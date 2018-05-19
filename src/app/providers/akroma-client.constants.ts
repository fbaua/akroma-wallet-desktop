export const clientConstants = {
    'clients': {
        'akroma': {
            'version': '0.0.8',
            'platforms': {
                'linux': {
                    'x64': {
                        'download': {
                            'url': 'https://akromablob.blob.core.windows.net/build-binaries/linux/x64/geth',
                            'md5': 'd60af95f3a5b9d1045618a3dd8876fc7',
                        },
                        'bin': 'geth',
                        'extract_path': '/.config/akroma'
                    },
                    'x86': {
                        'download': {
                            'url': 'https://akromablob.blob.core.windows.net/build-binaries/linux/x32/geth',
                            'md5': '797edf313e593f6aeecb5df772626aa6',
                        },
                        'bin': 'geth',
                        'extract_path': '/.config/akroma'
                    }
                },
                'darwin': {
                    'x64': {
                        'download': {
                            'url': 'https://akromablob.blob.core.windows.net/build-binaries/darwin/x64/geth',
                            'md5': 'ed61a80aeeae2e8fe4f56932cf61edda',
                        },
                        'bin': 'geth',
                        'extract_path': '/.config/akroma'
                    },
                    'x86': {
                        'download': {
                            'url': 'https://akromablob.blob.core.windows.net/build-binaries/darwin/x32/geth',
                            'md5': '3d69407820c8d0ea6fb0406b1252d376',
                        },
                        'bin': 'geth',
                        'extract_path': '/.config/akroma'
                    }
                },
                'win32': {
                    'x64': {
                        'download': {
                            'url': 'https://akromablob.blob.core.windows.net/build-binaries/win32/x64/geth.exe',
                            'md5': '4fd0f7a0cb7f823708d427b7da81baac',
                        },
                        'bin': 'geth.exe',
                        'extract_path': '/.Akroma'
                    },
                    'x32': {
                        'download': {
                            'url': 'https://akromablob.blob.core.windows.net/build-binaries/win32/x32/geth.exe',
                            'md5': '08067722fa94b09dd0d083519060cb9b',
                        },
                        'bin': 'geth.exe',
                        'extract_path': '/.Akroma'
                    }
                }
            }
        }
    }
};
