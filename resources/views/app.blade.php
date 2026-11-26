<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="asset-url" content="{{ rtrim(asset(''), '/') }}">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        {{-- ccIntake97 crest favicon. Bump ?v= when the icon changes so browsers refetch. --}}
        <link rel="icon" href="{{ asset('favicon.ico?v=5') }}" sizes="any">
        <link rel="icon" href="{{ asset('favicon-32x32.png?v=5') }}" type="image/png" sizes="32x32">
        <link rel="icon" href="{{ asset('favicon-16x16.png?v=5') }}" type="image/png" sizes="16x16">
        <link rel="apple-touch-icon" href="{{ asset('apple-touch-icon.png?v=5') }}" sizes="180x180">
        <link rel="manifest" href="{{ asset('site.webmanifest?v=5') }}">
        <meta name="theme-color" content="#0B1220">

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @php
            $appName = config('app.name');
            $defaultTitle = ($appName && $appName !== 'Laravel')
                ? $appName
                : 'ccIntake97 — Cadet College Alumni Association · Class of 1997';
            $defaultDescription = 'The central alumni association for the 1997 intake across ten cadet colleges — directory, welfare, reunion, and fraternity.';
        @endphp
        <x-inertia::head>
            <title>{{ $defaultTitle }}</title>
            <meta head-key="description" name="description" content="{{ $defaultDescription }}">
            <meta head-key="og:type" property="og:type" content="website">
            <meta head-key="og:site_name" property="og:site_name" content="ccIntake97">
            <meta head-key="og:title" property="og:title" content="ccIntake97 — Cadet College Alumni Association · Class of 1997">
            <meta head-key="og:description" property="og:description" content="{{ $defaultDescription }}">
            <meta head-key="og:url" property="og:url" content="{{ url()->current() }}">
            <meta head-key="og:image" property="og:image" content="{{ asset('images/campus/hero-rcc-sunset.jpg') }}">
            <meta head-key="twitter:card" name="twitter:card" content="summary_large_image">
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
