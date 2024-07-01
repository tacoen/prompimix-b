<?php
// Check if a file is provided as a command-line argument
if (count($argv) < 2) {
    echo "Usage: php script.php <filename.html>\n";
    exit;
}

$filename = $argv[1];
$outputFilename = 'nice-' . $filename;

// Read the HTML file
$html = file_get_contents($filename);
$html = preg_replace_callback('/\> \</', function($match) {
    return '><';
}, $html);
// Use tidy to clean up and format the HTML
$config = array(
    'indent' => true,
    'output-xhtml' => false,
    'wrap' => 252,
    'preserve-entities' => true,
    'preserve-comments' => true,
    'drop-empty-elements' => false,
    'drop-empty-paras' => false
	
);
$tidy = new tidy();
$tidy->parseString($html, $config, 'UTF8');
$tidy->cleanRepair();
$output = $tidy->value;

// Print the output
echo $output."\n\n";

// Save the output to a file
file_put_contents($outputFilename, $output);

echo "HTML file saved as: $outputFilename\n";