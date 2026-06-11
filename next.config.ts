import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ['192.168.10.105'],
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Accept-CH',
                        value: 'Sec-CH-UA-Model, Sec-CH-UA-Platform-Version',
                    },
                    {
                        key: 'Critical-CH',
                        value: 'Sec-CH-UA-Model',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'ch-ua-model=(self), ch-ua-platform-version=(self)',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
