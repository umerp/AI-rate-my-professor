/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'lh3.googleusercontent.com',
              port: '', // leave empty unless a specific port is needed
              pathname: '/**', // match all paths
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '', // leave empty unless a specific port is needed
                pathname: '/**', // match all paths
              },
          ],
      },
};

export default nextConfig;
