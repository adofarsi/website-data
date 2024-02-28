<?php
// URL or path to the JSON file
$jsonUrl = "https://github.com/adofarsi/website-data/blob/main/conferences.json?raw=true";

// Fetch the JSON content
$jsonContent = file_get_contents($jsonUrl);

// Decode the JSON content into a PHP variable
$data = json_decode($jsonContent);

// Check if decoding was successful
if ($data === null) {
    echo "Error decoding JSON.";
    exit;
}

// Start the output buffer
ob_start();
?>
<ul>
<?php foreach ($data as $entry): ?>
    <li><?php echo htmlspecialchars($entry->name); ?> --- <?php echo htmlspecialchars($entry->location); ?></li>
<?php endforeach; ?>
</ul>
<?php
// Get the buffer content
$output = ob_get_clean();

// FOR DEBUGGING: Output the HTML content
// Create an HTML file
$file = fopen("output.html", "w");
if ($file) {
    fwrite($file, $output);
    fclose($file);
    echo "HTML file created successfully.";
} else {
    echo "Error creating HTML file.";
}
