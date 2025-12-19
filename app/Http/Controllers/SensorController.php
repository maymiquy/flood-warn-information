<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSensorRequest;
use App\Http\Requests\UpdateSensorRequest;
use App\Models\Sensor;
use App\Services\SensorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SensorController extends Controller
{
    public function __construct(
        protected SensorService $sensorService
    ) {}

    public function apiIndex(Request $request): JsonResponse
    {
        $filters = [
            'status' => $request->input('status', 'all'),
            'search' => $request->input('search'),
        ];

        $sensors = $this->sensorService->getSensorsFiltered($filters);

        return response()->json([
            'success' => true,
            'data' => $sensors,
            'total' => count($sensors),
            'stats' => $this->sensorService->getStatistics(),
        ]);
    }

    public function apiShow(Sensor $sensor): JsonResponse
    {
        $sensorWithLogs = $this->sensorService->getSensorWithLogs($sensor->id);

        return response()->json([
            'success' => true,
            'data' => $sensorWithLogs,
        ]);
    }

    public function apiStore(StoreSensorRequest $request): JsonResponse
    {
        $sensor = $this->sensorService->createSensor($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Sensor berhasil ditambahkan.',
            'data' => $this->sensorService->formatSensorAsMarker($sensor),
        ], 201);
    }

    public function apiUpdate(UpdateSensorRequest $request, Sensor $sensor): JsonResponse
    {
        $updatedSensor = $this->sensorService->updateSensor($sensor, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Sensor berhasil diperbarui.',
            'data' => $this->sensorService->formatSensorAsMarker($updatedSensor),
        ]);
    }

    public function apiDestroy(Sensor $sensor): JsonResponse
    {
        $this->sensorService->deleteSensor($sensor);

        return response()->json([
            'success' => true,
            'message' => 'Sensor berhasil dihapus.',
        ]);
    }

    public function getMapMarkers(Request $request): JsonResponse
    {
        $status = $request->input('status');
        $markers = $this->sensorService->getMapMarkers($status);

        return response()->json([
            'success' => true,
            'data' => $markers,
            'total' => count($markers),
        ]);
    }

    public function updateStatus(Request $request, Sensor $sensor): JsonResponse
    {
        $request->validate([
            'water_level' => 'required|numeric|min:0',
        ]);

        $updatedSensor = $this->sensorService->updateWaterLevel(
            $sensor,
            $request->input('water_level')
        );

        return response()->json([
            'success' => true,
            'message' => 'Status sensor berhasil diperbarui.',
            'data' => $this->sensorService->formatSensorAsMarker($updatedSensor),
        ]);
    }
}
