changequote(`<%', `%>')dnl c-style
<!doctype html>
<html>
<head>
    <style> undivert(<%style.css%>) </style>
</head>
<body>
    <div class="chart-wrapper"> <canvas id="benchmark_chart"></canvas> </div>
    undivert(<%components/help.html%>)
    undivert(<%components/terminal.html%>)
    <script> undivert(<%chart.min.js%>)       </script>
    <script> undivert(<%app.js%>)             </script>
    dnl bif.js needs to be generated
    <script> undivert(<%../build/bif.js%>)    </script>
</body>
</html>
