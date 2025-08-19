// server/api/directus-image/[...].ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const path = event.context.params?._ || ''
  
  // Получаем query параметры
  const query = getQuery(event)
  const queryString = new URLSearchParams(query as any).toString()
  
  try {
    const response = await $fetch(`${config.directusUrl}/assets/${path}${queryString ? '?' + queryString : ''}`, {
      headers: {
        'Authorization': `Bearer ${config.directusToken}`
      },
      responseType: 'arrayBuffer'
    })
    
    // Устанавливаем правильные заголовки
    setResponseHeaders(event, {
      'Content-Type': response.headers.get('content-type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000'
    })
    
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch image'
    })
  }
})