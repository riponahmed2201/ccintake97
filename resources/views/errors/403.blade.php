<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>403 · Access Restricted — ccIntake97</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />
    <style>
        *, *::before, *::after { box-sizing: border-box; }
        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 32px 24px;
            background-color: #ffffff;
            color: #071437;
            font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            width: 100%;
            max-width: 520px;
            text-align: center;
        }
        .illustration {
            width: 100%;
            max-width: 300px;
            height: auto;
            margin: 0 auto 24px;
            display: block;
        }
        .eyebrow {
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #1B84FF;
            margin-bottom: 10px;
        }
        h1 {
            margin: 0;
            font-size: 26px;
            font-weight: 700;
            letter-spacing: -0.025em;
            color: #071437;
            line-height: 1.25;
        }
        .message {
            margin: 12px auto 0;
            max-width: 440px;
            font-size: 14.5px;
            line-height: 1.65;
            color: #4B5675;
        }
        .subtext {
            margin: 8px auto 0;
            max-width: 420px;
            font-size: 13px;
            line-height: 1.6;
            color: #99A1B7;
        }
        .actions {
            margin-top: 28px;
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            justify-content: center;
        }
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            height: 42px;
            padding: 0 20px;
            border-radius: 8px;
            font-size: 13.5px;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.15s ease;
        }
        .btn-primary {
            background: #1B84FF;
            color: #ffffff;
            border: 1px solid #1B84FF;
            box-shadow: 0 4px 12px rgba(27, 132, 255, 0.22);
        }
        .btn-primary:hover {
            background: #006AE6;
            border-color: #006AE6;
        }
        .btn-secondary {
            background: #ffffff;
            color: #4B5675;
            border: 1px solid #DBDFE9;
        }
        .btn-secondary:hover {
            background: #F9F9F9;
            color: #071437;
        }
        .footer-brand {
            margin-top: 40px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            font-weight: 600;
            color: #99A1B7;
            text-decoration: none;
        }
        .footer-brand:hover {
            color: #071437;
        }
    </style>
</head>
<body>
    <main class="container">
        <!-- Custom Clean Vector Illustration -->
        <svg class="illustration" viewBox="0 0 340 230" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <!-- Soft background glow -->
            <ellipse cx="170" cy="196" rx="115" ry="14" fill="#F1F6FF" />
            <circle cx="170" cy="112" r="88" fill="#F8FAFC" stroke="#F1F1F4" stroke-width="1.5" />
            <circle cx="170" cy="112" r="68" stroke="#E2E8F0" stroke-width="1.2" stroke-dasharray="5 5" />

            <!-- Subtle floating card left -->
            <rect x="38" y="72" width="76" height="54" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
            <circle cx="56" cy="90" r="8" fill="#F1F6FF" />
            <rect x="70" y="85" width="32" height="5" rx="2.5" fill="#CBD5E1" />
            <rect x="70" y="94" width="22" height="4" rx="2" fill="#E2E8F0" />
            <rect x="48" y="108" width="54" height="6" rx="3" fill="#F1F5F9" />

            <!-- Subtle floating badge right -->
            <rect x="228" y="64" width="72" height="36" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
            <circle cx="244" cy="82" r="5" fill="#1B84FF" fill-opacity="0.16" />
            <circle cx="244" cy="82" r="2.5" fill="#1B84FF" />
            <text x="255" y="86" fill="#071437" font-family="Inter, sans-serif" font-size="12" font-weight="700" letter-spacing="0.04em">403</text>

            <!-- Central Shield -->
            <path d="M170 38L222 57V107C222 141.5 199.5 170 170 182C140.5 170 118 141.5 118 107V57L170 38Z" fill="#071437" />
            <path d="M170 44L216 61V107C216 138 196 164 170 175.5C144 164 124 138 124 107V61L170 44Z" fill="url(#shield-grad)" stroke="#D4AF37" stroke-opacity="0.45" stroke-width="1.5" />

            <!-- Padlock inside Shield -->
            <rect x="148" y="102" width="44" height="34" rx="8" fill="#FFFFFF" />
            <path d="M157 102V92C157 84.8203 162.82 79 170 79C177.18 79 183 84.8203 183 92V102" stroke="#D4AF37" stroke-width="4.5" stroke-linecap="round" />
            <circle cx="170" cy="117" r="4" fill="#1B84FF" />
            <path d="M170 121V127" stroke="#1B84FF" stroke-width="3" stroke-linecap="round" />

            <!-- Decorative sparkles -->
            <path d="M95 44L97.2 49.8L103 52L97.2 54.2L95 60L92.8 54.2L87 52L92.8 49.8L95 44Z" fill="#1B84FF" fill-opacity="0.45" />
            <circle cx="256" cy="142" r="4" fill="#D4AF37" fill-opacity="0.6" />
            <circle cx="84" cy="154" r="3" fill="#CBD5E1" />

            <defs>
                <linearGradient id="shield-grad" x1="170" y1="44" x2="170" y2="175.5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#13295C" />
                    <stop offset="1" stop-color="#071437" />
                </linearGradient>
            </defs>
        </svg>

        <div class="eyebrow">403 · Access Restricted</div>
        <h1>Verification Required</h1>
        <p class="message">
            {{ $exception->getMessage() ?: 'You do not have permission to view this page.' }}
        </p>

        @auth
            <p class="subtext">
                Complete your college and personal profile so your college representative or administrator can verify your membership.
            </p>
        @endauth

        <div class="actions">
            @auth
                <a href="{{ url('/member/profile') }}" class="btn btn-primary">
                    Complete Profile
                </a>
                <a href="{{ url('/member/dashboard') }}" class="btn btn-secondary">
                    Back to Dashboard
                </a>
            @else
                <a href="{{ url('/login') }}" class="btn btn-primary">
                    Sign in
                </a>
                <a href="{{ url('/') }}" class="btn btn-secondary">
                    Go to Home
                </a>
            @endauth
        </div>

        <a href="{{ auth()->check() ? url('/member/dashboard') : url('/') }}" class="footer-brand">
            <span>ccIntake97 · Cadet College Alumni Association</span>
        </a>
    </main>
</body>
</html>
