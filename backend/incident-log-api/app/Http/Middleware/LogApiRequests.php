<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogApiRequests
{
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);

        // Log incoming request
        $this->logRequest($request);

        // Process request
        $response = $next($request);

        // Log response
        $this->logResponse($request, $response, $startTime);

        return $response;
    }

    protected function logRequest(Request $request): void
    {
        $method = $request->method();
        $url = $request->fullUrl();
        $ip = $request->ip();
        $user = $request->user() ? $request->user()->email : 'Guest';

        // Use error_log to output to stderr (terminal) instead of response body
        error_log("\n");
        error_log("╔════════════════════════════════════════════════════════════════════════════════");
        error_log("║ 📥 INCOMING REQUEST");
        error_log("╠════════════════════════════════════════════════════════════════════════════════");
        error_log("║ Method:    {$method}");
        error_log("║ Endpoint:  {$url}");
        error_log("║ User:      {$user}");
        error_log("║ IP:        {$ip}");
        error_log("║ Time:      " . now()->format('Y-m-d H:i:s'));

        // Log request body for POST/PUT/PATCH
        if (in_array($method, ['POST', 'PUT', 'PATCH']) && $request->getContent()) {
            $body = $request->except(['password', 'password_confirmation']);
            if (!empty($body)) {
                error_log("║ Body:      " . json_encode($body, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
            }
        }

        error_log("╚════════════════════════════════════════════════════════════════════════════════");
    }

    protected function logResponse(Request $request, Response $response, float $startTime): void
    {
        $duration = round((microtime(true) - $startTime) * 1000, 2);
        $statusCode = $response->getStatusCode();
        $method = $request->method();
        $url = $request->path();

        // Determine status emoji
        $statusEmoji = match(true) {
            $statusCode >= 200 && $statusCode < 300 => '✅',
            $statusCode >= 300 && $statusCode < 400 => '↪️',
            $statusCode >= 400 && $statusCode < 500 => '⚠️',
            $statusCode >= 500 => '❌',
            default => '📄'
        };

        error_log("\n");
        error_log("╔════════════════════════════════════════════════════════════════════════════════");
        error_log("║ 📤 RESPONSE {$statusEmoji}");
        error_log("╠════════════════════════════════════════════════════════════════════════════════");
        error_log("║ Status:    {$statusCode} " . $this->getStatusText($statusCode));
        error_log("║ Duration:  {$duration}ms");
        error_log("║ Endpoint:  {$method} /{$url}");

        // Show response preview
        $content = $response->getContent();
        if ($content && $this->isJson($content)) {
            $json = json_decode($content, true);
            $preview = json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            
            // Limit preview length
            if (strlen($preview) > 500) {
                $preview = substr($preview, 0, 500) . "\n    ... (truncated)";
            }
            
            error_log("║ Response:  {$preview}");
        }

        error_log("╚════════════════════════════════════════════════════════════════════════════════\n");
    }

    protected function isJson(string $string): bool
    {
        json_decode($string);
        return json_last_error() === JSON_ERROR_NONE;
    }

    protected function getStatusText(int $code): string
    {
        return match($code) {
            200 => 'OK',
            201 => 'Created',
            204 => 'No Content',
            400 => 'Bad Request',
            401 => 'Unauthorized',
            403 => 'Forbidden',
            404 => 'Not Found',
            422 => 'Unprocessable Entity',
            500 => 'Internal Server Error',
            default => ''
        };
    }
}
