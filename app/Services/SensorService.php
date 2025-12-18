<?php

namespace App\Services;

use App\Models\Sensor;
use App\Models\WaterLevelLog;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class SensorService
{
    public function getAllSensors(): Collection
    {
        return Sensor::orderBy('name')->get();
    }

    public function getSensorById(int $id): ?Sensor
    {
        return Sensor::find($id);
    }

    public function getSensorWithLogs(int $id, int $logLimit = 24): ?Sensor
    {
        return Sensor::with(['waterLevelLogs' => function ($query) use ($logLimit) {
            $query->orderBy('recorded_at', 'desc')->limit($logLimit);
        }])->find($id);
    }

    public function getActiveSensors(): Collection
    {
        return Sensor::where('is_active', true)
            ->orderBy('name')
            ->get();
    }

    public function getSensorsByStatus(string $status): Collection
    {
        return Sensor::where('is_active', true)
            ->where('status', $status)
            ->orderBy('name')
            ->get();
    }

    public function getSensorsFiltered(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = Sensor::query();

        if (isset($filters['status']) && $filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        if (isset($filters['search']) && $filters['search']) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('name')->paginate($perPage)->withQueryString();
    }

    public function getMapMarkers(?string $status = null): array
    {
        $query = Sensor::where('is_active', true);

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $sensors = $query->get();

        return $sensors->map(function ($sensor) {
            return $this->formatSensorAsMarker($sensor);
        })->toArray();
    }

    public function formatSensorAsMarker(Sensor $sensor): array
    {
        return [
            'id' => $sensor->id,
            'name' => $sensor->name,
            'code' => $sensor->code,
            'position' => [
                'lat' => (float) $sensor->latitude,
                'lng' => (float) $sensor->longitude,
            ],
            'status' => $sensor->status,
            'statusLabel' => $sensor->status_label,
            'statusColor' => $sensor->status_color,
            'waterLevel' => (float) $sensor->water_level,
            'address' => $sensor->address,
            'description' => $sensor->description,
            'lastReadingAt' => $sensor->last_reading_at?->toISOString(),
            'lastReadingAtFormatted' => $sensor->last_reading_at?->diffForHumans(),
        ];
    }

    public function updateWaterLevel(Sensor $sensor, float $waterLevel): Sensor
    {
        $status = $this->calculateStatus($waterLevel);

        $sensor->update([
            'water_level' => $waterLevel,
            'status' => $status,
            'last_reading_at' => now(),
        ]);

        $this->createWaterLevelLog($sensor, $waterLevel, $status);

        return $sensor->fresh();
    }

    public function calculateStatus(float $waterLevel): string
    {
        if ($waterLevel <= 50) {
            return Sensor::STATUS_SAFE;
        } elseif ($waterLevel <= 100) {
            return Sensor::STATUS_WARNING;
        } else {
            return Sensor::STATUS_DANGER;
        }
    }

    public function createWaterLevelLog(Sensor $sensor, float $waterLevel, string $status): WaterLevelLog
    {
        return $sensor->waterLevelLogs()->create([
            'water_level' => $waterLevel,
            'status' => $status,
            'recorded_at' => now(),
        ]);
    }

    public function getStatistics(): array
    {
        $sensors = Sensor::where('is_active', true)->get();

        return [
            'total' => $sensors->count(),
            'safe' => $sensors->where('status', Sensor::STATUS_SAFE)->count(),
            'warning' => $sensors->where('status', Sensor::STATUS_WARNING)->count(),
            'danger' => $sensors->where('status', Sensor::STATUS_DANGER)->count(),
        ];
    }

    public function getSensorsList(?string $status = null, ?string $search = null): array
    {
        $query = Sensor::where('is_active', true);

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        $sensors = $query->orderBy('name')->get();

        return $sensors->map(function ($sensor) {
            return [
                'id' => $sensor->id,
                'name' => $sensor->name,
                'code' => $sensor->code,
                'status' => $sensor->status,
                'statusLabel' => $sensor->status_label,
                'statusColor' => $sensor->status_color,
                'waterLevel' => (float) $sensor->water_level,
                'address' => $sensor->address,
                'position' => [
                    'lat' => (float) $sensor->latitude,
                    'lng' => (float) $sensor->longitude,
                ],
            ];
        })->toArray();
    }

    public function createSensor(array $data): Sensor
    {
        if (isset($data['water_level'])) {
            $data['status'] = $this->calculateStatus($data['water_level']);
        }

        return Sensor::create($data);
    }

    public function updateSensor(Sensor $sensor, array $data): Sensor
    {
        if (isset($data['water_level'])) {
            $data['status'] = $this->calculateStatus($data['water_level']);
        }

        $sensor->update($data);

        return $sensor->fresh();
    }

    public function deleteSensor(Sensor $sensor): bool
    {
        return $sensor->delete();
    }
}
