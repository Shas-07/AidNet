<?php
// Sathi AI backend - Health Care Chatbot (Intent-based)
// Inspired by: https://github.com/amberkakkar01/Health-Care-Chatbot
// This replaces Gemini with a rule-based medical chatbot

require_once __DIR__ . '/utils.php';

$payload = read_json_body();

$message = $payload['message'] ?? '';
$image   = $payload['image']   ?? null;
$type    = $payload['type']    ?? 'text';

if ($message === '' && !$image) {
    json_response(false, null, 'Empty request');
}

// Load intents from JSON file
$intentsFile = __DIR__ . '/intents.json';
if (!file_exists($intentsFile)) {
    json_response(false, null, 'Intents file not found');
}

$intentsData = json_decode(file_get_contents($intentsFile), true);
if (!$intentsData || !isset($intentsData['intents'])) {
    json_response(false, null, 'Invalid intents file');
}

// Process the message
$userMessage = strtolower(trim($message));
$matchedIntent = null;
$bestMatchScore = 0;

// Find best matching intent
foreach ($intentsData['intents'] as $intent) {
    $patterns = $intent['patterns'] ?? [];
    $score = 0;
    
    // Check if any pattern matches
    foreach ($patterns as $pattern) {
        $patternLower = strtolower($pattern);
        // Exact match gets highest score
        if ($userMessage === $patternLower) {
            $score = 100;
            break;
        }
        // Word match gets medium score
        if (strpos($userMessage, $patternLower) !== false) {
            $score = max($score, 50);
        }
        // Partial match gets lower score
        if (similar_text($userMessage, $patternLower) > 60) {
            $score = max($score, 30);
        }
    }
    
    if ($score > $bestMatchScore) {
        $bestMatchScore = $score;
        $matchedIntent = $intent;
    }
}

// If no good match, use no_answer intent
if ($bestMatchScore < 20) {
    foreach ($intentsData['intents'] as $intent) {
        if ($intent['tag'] === 'no_answer') {
            $matchedIntent = $intent;
            break;
        }
    }
}

// Get response
$response = '';
if ($matchedIntent && isset($matchedIntent['responses']) && !empty($matchedIntent['responses'])) {
    // Pick a random response from the intent's responses
    $responses = $matchedIntent['responses'];
    $response = $responses[array_rand($responses)];
} else {
    $response = "I'm here to help with health questions. Could you provide more details about what you'd like to know?";
}

// Handle image uploads
if ($image) {
    $imageResponse = "I can see you've uploaded an image. While I cannot provide a medical diagnosis, here are some general guidelines:\n\n";
    $imageResponse .= "**For Injury Photos:**\n";
    $imageResponse .= "• Clean the wound with mild soap and water\n";
    $imageResponse .= "• Apply a sterile bandage\n";
    $imageResponse .= "• Monitor for infection signs\n";
    $imageResponse .= "• Seek medical help if severe or worsening\n\n";
    $imageResponse .= "**For Skin Condition Photos:**\n";
    $imageResponse .= "• Keep the area clean and dry\n";
    $imageResponse .= "• Avoid scratching or picking\n";
    $imageResponse .= "• Consider gentle, fragrance-free products\n";
    $imageResponse .= "• Consult a dermatologist if persistent\n\n";
    $imageResponse .= "⚠️ **Important:** I provide suggestions, not medical diagnoses. Always consult a healthcare professional for proper evaluation.";
    
    $response = $imageResponse;
}

// Add medical disclaimer to all responses
$response .= "\n\n⚠️ **Medical Disclaimer:** I provide general health information and suggestions only. I do not diagnose, prescribe, or replace professional medical advice. Always consult a qualified healthcare provider for medical concerns or emergencies.";

json_response(true, ['reply' => $response]);
