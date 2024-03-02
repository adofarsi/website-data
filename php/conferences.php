<?php
function custom_conferences_shortcode()
{
    // URL or path to the JSON file
    $jsonUrl = "https://github.com/adofarsi/website-data/blob/main/json/conferences.json?raw=true";

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

    echo '<style>
    details > summary {
        list-style: none; /* Attempt to remove the default arrow */
    }
    details > summary::-webkit-details-marker {
        display: none; /* Specific to WebKit browsers like Chrome and Safari */
    }
    details > summary:before {
        content: ">"; /* Arrow down */
        padding-right: 8px;
        font-size: 16px;
    }
    
    details[open] > summary:before {
        content: "⌄"; /* Arrow up */
    }
</style>';

    ?>
    <ul>
    <?php foreach ($data as $entry): ?>
        <details <?php if ($counter === 0) echo "open"; ?>>
			<summary> [<?php echo $entry->id; ?>] <strong> <?php echo $entry->name; ?> </strong></summary>
            <p style="margin-left: 4em; margin-top: 5px"><em><?php echo $entry->location; ?> (<?php echo $entry->date; ?>) </em></p>
			<p style="margin-left: 1.5em; margin-top: 0px"><?php echo $entry->contribution; ?>.</p>

        </details>
        <?php $counter++; ?>
    <?php endforeach; ?>
    </ul>
    <?php

    // Get the buffer content and return it
    return ob_get_clean();
}

//////////////////////////////////////////
// FOR DEBUGGING: Output the HTML content
// Create an HTML file
$file = fopen("conferences.html", "w");
if ($file) {
    fwrite($file, custom_conferences_shortcode());
    fclose($file);
    echo "HTML file created successfully.";
} else {
    echo "Error creating HTML file.";
}
//////////////////////////////////////////