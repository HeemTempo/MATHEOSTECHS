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

        $this->logRequest($request);

        $response = $next($request);

        $this->logResponse($request, $response, $startTime);

        return $response;
    }

    protected function logRequest(Request $request): void
    {
        $method = $request->method();
        $url = $request->fullUrl();
        $ip = $request->ip();
        $user = $request->user() ? $request->user()->email : 'Guest';

        error_log("\n");
        error_log("================================================================================");
        error_log("INCOMING REQUEST");
        error_log("================================================================================");
        error_log("Method:    {$method}");
        error_log("Endpoint:  {$url}");
        error_log("User:      {$user}");
        error_log("IP:        {$ip}");
        error_log("Time:      " . now()->format('Y-m-d H:i:s'));

        if (in_array($method, ['POST', 'PUT', 'PATCH']) && $request->getContent()) {
            $body = $request->except(['password', 'password_confirmation']);
            if (!empty($body)) {
                error_log("Body:      " . json_encode($body, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
            }
        }

        error_log("================================================================================");
    }

    protected function logResponse(Request $request, Response $response, float $startTime): void
    {
        $duration = round((microtime(true) - $startTime) * 1000, 2);
        $statusCode = $response->getStatusCode();
        $method = $request->method();
        $url = $request->path();

        error_log("\n");
        error_log("================================================================================");
        error_log("RESPONSE");
        error_log("================================================================================");
        error_log("Status:    {$statusCode} " . $this->getStatusText($statusCode));
        error_log("Duration:  {$duration}ms");
        error_log("Endpoint:  {$method} /{$url}");

        $content = $response->getContent();
        if ($content && $this->isJson($content)) {
            $json = json_decode($content, true);
            $preview = json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            
            if (strlen($preview) > 500) {
                $preview = substr($preview, 0, 500) . "\n... (truncated)";
            }
            
            error_log("Response:  {$preview}");
        }

        error_log("================================================================================\n");
    }

    protected function isJson(string $string): bool
    {
        json_decode($string);
        return json_last_error() === JSON_ERROR_NONE;
    }

    protected function getStatusText(int $code): string
    {
        if ($code === 200) return 'OK';
        if ($code === 201) return 'Created';
        if ($code === 204) return 'No Content';
        if ($code === 400) return 'Bad Request';
        if ($code === 401) return 'Unauthorized';
        if ($code === 403) return 'Forbidden';
        if ($code === 404) return 'Not Found';
        if ($code === 422) return 'Unprocessable Entity';
        if ($code === 500) return 'Internal Server Error';
        
        return '';
    }
}
