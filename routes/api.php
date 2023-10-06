<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ApiController;

Route::prefix('v1')->group(function () {
    
    
    
    Route::middleware('auth:api')->group(function () {
        
        Route::post('/create-token', [ApiController::class, 'CreateToken'])->name('api.createToken');    
        Route::post('/is-user-sennova', [ApiController::class, 'isUserSennova'])->name('api.isUserSennova');    
        Route::get('/projects-by-user/{id}', [ApiController::class, 'projectsByUser'])->name('api.projectsByUser');    
        Route::get('/projects-by-center/{id}', [ApiController::class, 'projectsByCenter'])->name('api.projectsByCenter');    
        Route::get('/summary-project/{id}', [ApiController::class, 'summaryProject'])->name('api.summaryProject');
    });
});