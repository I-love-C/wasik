changequote(`<%', `%>')dnl c-style
<!doctype html>
<html>
<head>
    <style> undivert(<%style.css%>) </style>
</head>
<body>
    <canvas id="benchmark_chart"></canvas>
    <script> undivert(<%chart.min.js%>)       </script>
    <script> undivert(<%commands.js%>)        </script>
    dnl bif.js needs to be generated
    <script> undivert(<%../build/bif.js%>)    </script>
</body>
</html>
