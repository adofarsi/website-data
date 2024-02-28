<?php
function custom_conferences_shortcode()
{
    // URL or path to the JSON file
    $jsonUrl = "https://github.com/adofarsi/website-data/blob/main/conferences.json?raw=true";

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
        <details <?php if ($counter === 0) echo "open"; ?>>
			<summary> <strong> [<?php echo $entry->id; ?>] <?php echo htmlspecialchars($entry->name, ENT_QUOTES, 'UTF-8'); ?> </strong></summary>
			<hr style="height:10px; visibility:hidden;" />
            <p>&nbsp;<?php echo htmlspecialchars($entry->contribution, ENT_QUOTES, 'UTF-8'); ?></p>
            <p><em><?php echo htmlspecialchars($entry->location, ENT_QUOTES, 'UTF-8'); ?></em>
            <br><?php echo htmlspecialchars($entry->date, ENT_QUOTES, 'UTF-8'); ?></p>
        </details>
        <?php $counter++; ?>

    <?php endforeach; ?>
    </ul>
    <?php

    // Get the buffer content and return it
    return ob_get_clean();
}

// Register the shortcode with WordPress
//add_shortcode('custom_conferences', 'custom_conferences_shortcode');
echo custom_conferences_shortcode();