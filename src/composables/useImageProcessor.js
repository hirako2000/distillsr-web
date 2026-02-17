import { ref } from 'vue'
import * as ort from 'onnxruntime-web'


export default function useImageProcessor() {
  const session = ref(null)
  const isProcessing = ref(false)
  const processedTiles = ref(0)
  const totalTiles = ref(0)
  const workerVisible = ref(false)
  const workerText = ref('Processing...')
  const backendInfo = ref('Initializing...')
  const backendVisible = ref(false)
  const backendText = ref('CPU')
  const backendClass = ref('cpu-warning')
  const status = ref('loading')
  const statusText = ref('Initializing...')
  const errorVisible = ref(false)
  const errorText = ref('')

  const scale = 4

  const hideError = () => {
    errorVisible.value = false
  }

  const showError = (message) => {
    errorText.value = message
    errorVisible.value = true
    setTimeout(hideError, 5000)
  }

  const setStatus = (newStatus, text) => {
    status.value = newStatus
    statusText.value = text
  }

  const loadModel = async (modelPath, modelName) => {
    try {
      setStatus('loading', `Loading ${modelName} model...`)

      if (session.value) {
        session.value.release()
        session.value = null
      }

      const hasWebGPU = typeof navigator !== 'undefined' && 'gpu' in navigator

      const providers = []
      if (hasWebGPU) {
        providers.push('webgpu')
      }
      providers.push('wasm')

      const options = {
        executionProviders: providers,
        graphOptimizationLevel: 'all',
        enableCpuMemArena: true,
        enableMemPattern: true,
      }

      session.value = await ort.InferenceSession.create(modelPath, options)

      let usedProvider = 'wasm'
      try {
        if (session.value.getProvider) {
          usedProvider = session.value.getProvider()
        } else if (session.value.providers) {
          usedProvider = session.value.providers[0]
        }
      } catch (e) {
        usedProvider = providers[0] === 'webgpu' ? 'webgpu' : 'wasm'
      }

      const isGPU = usedProvider === 'webgpu' || usedProvider?.includes('webgpu')
      backendInfo.value = isGPU ? 'WebGPU' : 'WebAssembly'
      backendVisible.value = true
      backendText.value = isGPU ? 'GPU/GPU' : 'GPU/CPU'
      backendClass.value = isGPU ? 'gpu-indicator' : 'cpu-warning'

      setStatus('loaded', `${modelName} model ready`)

    } catch (error) {
      console.error('Failed to load model:', error)

      try {
        const wasmOptions = {
          executionProviders: ['wasm'],
          graphOptimizationLevel: 'all'
        }

        session.value = await ort.InferenceSession.create(modelPath, wasmOptions)
        backendInfo.value = 'WebAssembly'
        backendVisible.value = true
        backendText.value = 'CPU'
        backendClass.value = 'cpu-warning'
        setStatus('loaded', `${modelName} model ready (CPU)`)

      } catch (wasmError) {
        console.error('WASM fallback also failed:', wasmError)
        setStatus('error', 'Model loading failed')
        showError(`Could not load model: ${error.message}`)
      }
    }
  }

  const runTiledInference = async (originalImage, originalDimensions, modelName) => {
    if (!session.value || !originalImage || isProcessing.value) return null

    isProcessing.value = true
    workerVisible.value = true
    workerText.value = 'Processing 0%...'

    try {
      hideError()

      const MAX_TILE_SIZE = 256
      const TARGET_TILES = 1
      const OVERLAP_FACTOR = 0.125

      const maxDimension = Math.max(originalDimensions.width, originalDimensions.height)
      let tileSize = MAX_TILE_SIZE

      if (maxDimension <= MAX_TILE_SIZE) {
        tileSize = Math.ceil(maxDimension / 4) * 4
      } else {
        const targetTileSize = Math.ceil(maxDimension / TARGET_TILES)
        tileSize = Math.min(MAX_TILE_SIZE, Math.ceil(targetTileSize / 4) * 4)
      }

      tileSize = Math.min(MAX_TILE_SIZE, Math.ceil(tileSize / 4) * 4)
      const overlap = Math.max(8, Math.floor(tileSize * OVERLAP_FACTOR / 4) * 4)
      const step = tileSize - overlap

      const tilesX = Math.max(1, Math.ceil((originalDimensions.width - tileSize) / step) + 1)
      const tilesY = Math.max(1, Math.ceil((originalDimensions.height - tileSize) / step) + 1)

      totalTiles.value = tilesX * tilesY
      processedTiles.value = 0

      const sourceCanvas = document.createElement('canvas')
      sourceCanvas.width = originalDimensions.width
      sourceCanvas.height = originalDimensions.height
      const sourceCtx = sourceCanvas.getContext('2d')
      sourceCtx.drawImage(originalImage, 0, 0)

      const outputWidth = originalDimensions.width * scale
      const outputHeight = originalDimensions.height * scale
      const outputCanvas = document.createElement('canvas')
      outputCanvas.width = outputWidth
      outputCanvas.height = outputHeight
      const outputCtx = outputCanvas.getContext('2d')

      for (let ty = 0; ty < tilesY; ty++) {
        for (let tx = 0; tx < tilesX; tx++) {
          const x = Math.min(tx * step, originalDimensions.width - tileSize)
          const y = Math.min(ty * step, originalDimensions.height - tileSize)

          const tileWidth = Math.min(tileSize, originalDimensions.width - x)
          const tileHeight = Math.min(tileSize, originalDimensions.height - y)

          let validX = 0
          let validY = 0
          let validWidth = tileWidth
          let validHeight = tileHeight

          if (totalTiles.value > 1) {
            if (tx > 0) {
              validX = Math.floor(overlap / 2)
              validWidth = tileWidth - validX
            }
            if (tx < tilesX - 1) {
              validWidth = tileSize - Math.floor(overlap / 2)
            }
            if (ty > 0) {
              validY = Math.floor(overlap / 2)
              validHeight = tileHeight - validY
            }
            if (ty < tilesY - 1) {
              validHeight = tileSize - Math.floor(overlap / 2)
            }
          }

          const paddedTileWidth = Math.ceil(tileWidth / 4) * 4
          const paddedTileHeight = Math.ceil(tileHeight / 4) * 4

          const tileCanvas = document.createElement('canvas')
          tileCanvas.width = paddedTileWidth
          tileCanvas.height = paddedTileHeight
          const tileCtx = tileCanvas.getContext('2d')

          tileCtx.fillStyle = '#000000'
          tileCtx.fillRect(0, 0, paddedTileWidth, paddedTileHeight)
          tileCtx.drawImage(
            sourceCanvas,
            x, y, tileWidth, tileHeight,
            0, 0, tileWidth, tileHeight
          )

          const tileImageData = tileCtx.getImageData(0, 0, paddedTileWidth, paddedTileHeight)

          const tensorData = new Float32Array(1 * 3 * paddedTileHeight * paddedTileWidth)
          const data = tileImageData.data
          const area = paddedTileHeight * paddedTileWidth

          for (let i = 0; i < area; i++) {
            tensorData[i] = data[i * 4] / 255.0
            tensorData[area + i] = data[i * 4 + 1] / 255.0
            tensorData[2 * area + i] = data[i * 4 + 2] / 255.0
          }

          const inputTensor = new ort.Tensor('float32', tensorData, [1, 3, paddedTileHeight, paddedTileWidth])
          const feeds = { input: inputTensor }

          const results = await session.value.run(feeds)

          const outputTensor = results.output
          let outputData
          if (outputTensor.location === 'gpu-buffer') {
            outputData = await outputTensor.getData()
          } else {
            outputData = outputTensor.data
          }

          const outTileHeight = outputTensor.dims[2]
          const outTileWidth = outputTensor.dims[3]

          const outX = (x + validX) * scale
          const outY = (y + validY) * scale
          const outValidWidth = validWidth * scale
          const outValidHeight = validHeight * scale

          const tileOutCanvas = document.createElement('canvas')
          tileOutCanvas.width = outTileWidth
          tileOutCanvas.height = outTileHeight
          const tileOutCtx = tileOutCanvas.getContext('2d')
          const tileOutImageData = tileOutCtx.createImageData(outTileWidth, outTileHeight)

          const outData = tileOutImageData.data
          const outArea = outTileHeight * outTileWidth

          for (let i = 0; i < outArea; i++) {
            outData[i * 4] = Math.max(0, Math.min(255, Math.round(outputData[i] * 255)))
            outData[i * 4 + 1] = Math.max(0, Math.min(255, Math.round(outputData[outArea + i] * 255)))
            outData[i * 4 + 2] = Math.max(0, Math.min(255, Math.round(outputData[2 * outArea + i] * 255)))
            outData[i * 4 + 3] = 255
          }

          tileOutCtx.putImageData(tileOutImageData, 0, 0)

          outputCtx.drawImage(
            tileOutCanvas,
            validX * scale, validY * scale, outValidWidth, outValidHeight,
            outX, outY, outValidWidth, outValidHeight
          )

          processedTiles.value++
          const percentage = Math.round((processedTiles.value / totalTiles.value) * 100)
          workerText.value = `Processing ${percentage}%...`

          await new Promise(resolve => setTimeout(resolve, 10))
        }
      }

      return {
        imageData: outputCanvas.toDataURL('image/png'),
        width: outputWidth,
        height: outputHeight
      }

    } catch (error) {
      console.error('Processing failed:', error)
      showError('Processing failed: ' + error.message)
      return null
    } finally {
      isProcessing.value = false
      workerVisible.value = false
    }
  }

  return {
    session,
    isProcessing,
    processedTiles,
    totalTiles,
    workerVisible,
    workerText,
    backendInfo,
    backendVisible,
    backendText,
    backendClass,
    status,
    statusText,
    errorVisible,
    errorText,
    hideError,
    showError,
    setStatus,
    loadModel,
    runTiledInference
  }
}