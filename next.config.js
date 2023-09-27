/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.unsplash.com','res.cloudinary.com','source.unsplash.com','lh3.googleusercontent.com','avatars.githubusercontent.com'],
        formats: ['image/avif','image/webp']
      },
      experimental:{
        serverActions:true
      }
}

module.exports = nextConfig
