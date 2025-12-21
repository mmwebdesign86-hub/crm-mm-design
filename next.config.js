/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'files.cdn-files-a.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
}

module.exports = nextConfig
