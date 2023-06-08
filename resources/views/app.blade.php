<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    {{-- <meta name="viewport" content="width=device-width, initial-scale=1"> --}}
    {{-- <meta name="csrf-token" content="{{ csrf_token() }}"> --}}

    <title>{{ config('app.name', 'Laravel') }}</title>

    <link rel="Shortcut icon" href="{{ asset('images/favicon.ico') }}">

    <!-- Fonts -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap">

    <!-- Styles -->
    <link rel="stylesheet" href="{{ mix('css/app.css') }}">

    <!-- Scripts -->
    @routes
    <script src="{{ mix('js/app.js') }}" defer></script>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script>
        window.google
        google.charts.load('current', {
            packages: ['gantt'],
            language: 'es'
        })

        google.charts.load('current', {
            packages: ['orgchart'],
            language: 'es'
        })

        window.basePath = {!! sprintf('"%s"', env('MIX_ASSET_URL', null)) !!}
    </script>
</head>

<body class="font-sans antialiased" id="body">
    @inertia
</body>

</html>
