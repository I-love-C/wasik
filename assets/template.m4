changequote(`<%', `%>')dnl c-style
<!doctype html>
<html>
<head>
    <style>  undivert(<%style.css%>)        </style>
    <script> undivert(<%chart.min.js%>)     </script>
</head>
<body>
    <div class="chart-wrapper"> <canvas id="benchmark_chart"></canvas> </div>
    undivert(<%components/help.html%>)
    undivert(<%components/terminal.html%>)

    <script> undivert(<%../build/bif.js%>)  </script>
    <script> undivert(<%app.js%>)           </script>
</body>
</html>
