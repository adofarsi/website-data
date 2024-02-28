<?php
// URL or path to the JSON file
$jsonUrl = "https://github.com/adofarsi/website-data/blob/main/test.json?raw=true";

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
    <li><?php echo htmlspecialchars($entry->name); ?> - <?php echo htmlspecialchars($entry->description); ?></li>
<?php endforeach; ?>
</ul>
<?php
// Get the buffer content
$output = ob_get_clean();

// Display the content
echo $output;
?>