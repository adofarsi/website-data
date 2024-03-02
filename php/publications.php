<?php
function custom_conferences_shortcode()
{
    // URL or path to the JSON file
    $jsonUrl = "https://github.com/adofarsi/website-data/blob/main/json/publications.json?raw=true";

    // Fetch the JSON content
    $jsonContent = file_get_contents($jsonUrl);
    // Decode the JSON content into a PHP variable
    $data = json_decode($jsonContent);
    // Check if decoding was successful
    if ($data === null) {
        return "Content not available.";
    }

    // Initialize counter
    $counter = 0; 
    // Start the output buffer
    ob_start();

    ?>
    <ul>
    <?php foreach ($data as $entry): ?>
        <li>
            [<?php echo $entry->id; ?>]
            <?php foreach ($entry->authors as $author) {echo $author . ", ";}?> 
            (<?php echo $entry->year; ?>)
            <?php echo $entry->title; ?>. 
            <em><?php echo $entry->publisher; ?></em>.
            <?php if (!empty($entry->pdf)) echo "(<a href=$entry->pdf>pdf</a>)"; ?>
            <?php if (!empty($entry->doi)) echo "(<a href=$entry->doi>doi</a>)"; ?>
        </li>
    <?php endforeach; ?>
    </ul>
    <?php

    // Get the buffer content and return it
    return ob_get_clean();
}

//////////////////////////////////////////
// FOR DEBUGGING: Output the HTML content
// Create an HTML file
$file = fopen("publications.html", "w");
if ($file) {
    fwrite($file, custom_conferences_shortcode());
    fclose($file);
    echo "HTML file created successfully.";
} else {
    echo "Error creating HTML file.";
}
//////////////////////////////////////////