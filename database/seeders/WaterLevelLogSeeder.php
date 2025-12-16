<?php

namespace Database\Seeders;

use App\Models\Sensor;
use App\Models\WaterLevelLog;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class WaterLevelLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sensors = Sensor::all();

        if ($sensors->isEmpty()) {
            $this->command->warn('⚠️ Tidak ada sensor. Jalankan SensorSeeder terlebih dahulu.');
            return;
        }

        $totalLogs = 0;

        foreach ($sensors as $sensor) {
            for ($i = 24; $i >= 0; $i--) {
                $recordedAt = Carbon::now()->subHours($i);

                $baseLevel = $sensor->water_level;
                $variation = $this->generateWaterLevelVariation($i, $baseLevel);
                $waterLevel = max(5, $baseLevel + $variation);

                $status = WaterLevelLog::calculateStatus($waterLevel);

                WaterLevelLog::create([
                    'sensor_id' => $sensor->id,
                    'water_level' => round($waterLevel, 2),
                    'status' => $status,
                    'recorded_at' => $recordedAt,
                ]);

                $totalLogs++;
            }
        }

        $this->command->info("✅ Success, Total seed: {$totalLogs}");
    }

    private function generateWaterLevelVariation(int $hoursAgo, float $baseLevel): float
    {
        $hourOfDay = Carbon::now()->subHours($hoursAgo)->hour;

        $timeFactor = match (true) {
            $hourOfDay >= 5 && $hourOfDay <= 8 => rand(10, 30),
            $hourOfDay >= 12 && $hourOfDay <= 15 => rand(-20, -5),
            $hourOfDay >= 20 || $hourOfDay <= 4 => rand(5, 20),
            default => rand(-10, 10),
        };

        $noise = (rand(-100, 100) / 10);

        return $timeFactor + $noise;
    }
}
