<?php
if (isset($_POST['csv_data'])) {
    $csv_data = $_POST['csv_data'];
    $filename = 'info.csv';
    file_put_contents($filename, $csv_data);
    echo "File saved successfully!";
}
?>
