<?php

use App\Http\Controllers\FloodZoneController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\SensorController;
use Illuminate\Support\Facades\Route;

Route::get('/', [MapController::class, 'index'])->name('home');

Route::prefix('api')->group(function () {
    Route::get('map/data', [MapController::class, 'getMapData'])->name('api.map.data');
    Route::get('map/sensors', [MapController::class, 'getSensorsList'])->name('api.map.sensors');
    Route::get('map/zones', [MapController::class, 'getZonesList'])->name('api.map.zones');
    Route::get('map/dashboard', [MapController::class, 'getDashboardSummary'])->name('api.map.dashboard');

    Route::get('sensors', [SensorController::class, 'apiIndex'])->name('api.sensors.index');
    Route::get('sensors/markers', [SensorController::class, 'getMapMarkers'])->name('api.sensors.markers');
    Route::get('sensors/{sensor}', [SensorController::class, 'apiShow'])->name('api.sensors.show');
    Route::post('sensors', [SensorController::class, 'apiStore'])->name('api.sensors.store');
    Route::put('sensors/{sensor}', [SensorController::class, 'apiUpdate'])->name('api.sensors.update');
    Route::patch('sensors/{sensor}/status', [SensorController::class, 'updateStatus'])->name('api.sensors.status');
    Route::delete('sensors/{sensor}', [SensorController::class, 'apiDestroy'])->name('api.sensors.destroy');

    Route::get('flood-zones', [FloodZoneController::class, 'apiIndex'])->name('api.flood-zones.index');
    Route::get('flood-zones/polygons', [FloodZoneController::class, 'getPolygons'])->name('api.flood-zones.polygons');
    Route::get('flood-zones/{floodZone}', [FloodZoneController::class, 'apiShow'])->name('api.flood-zones.show');
    Route::post('flood-zones', [FloodZoneController::class, 'apiStore'])->name('api.flood-zones.store');
    Route::put('flood-zones/{floodZone}', [FloodZoneController::class, 'apiUpdate'])->name('api.flood-zones.update');
    Route::delete('flood-zones/{floodZone}', [FloodZoneController::class, 'apiDestroy'])->name('api.flood-zones.destroy');
});
