<?php

namespace Database\Factories;

use App\Models\Sensor;
use App\Models\WaterLevelLog;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WaterLevelLog>
 */
class WaterLevelLogFactory extends Factory
{
    protected $model = WaterLevelLog::class;

    public function definition(): array
    {
        $waterLevel = $this->faker->randomFloat(2, 10, 180);
        $status = WaterLevelLog::calculateStatus($waterLevel);

        return [
            'sensor_id' => Sensor::factory(),
            'water_level' => $waterLevel,
            'status' => $status,
            'recorded_at' => $this->faker->dateTimeBetween('-7 days', 'now'),
        ];
    }

    public function forSensor(Sensor $sensor): static
    {
        return $this->state(fn(array $attributes) => [
            'sensor_id' => $sensor->id,
        ]);
    }

    public function safe(): static
    {
        $waterLevel = $this->faker->randomFloat(2, 10, 50);
        return $this->state(fn(array $attributes) => [
            'water_level' => $waterLevel,
            'status' => WaterLevelLog::STATUS_SAFE,
        ]);
    }

    public function warning(): static
    {
        $waterLevel = $this->faker->randomFloat(2, 51, 100);
        return $this->state(fn(array $attributes) => [
            'water_level' => $waterLevel,
            'status' => WaterLevelLog::STATUS_WARNING,
        ]);
    }

    public function danger(): static
    {
        $waterLevel = $this->faker->randomFloat(2, 101, 200);
        return $this->state(fn(array $attributes) => [
            'water_level' => $waterLevel,
            'status' => WaterLevelLog::STATUS_DANGER,
        ]);
    }

    public function recordedAt(\DateTime $dateTime): static
    {
        return $this->state(fn(array $attributes) => [
            'recorded_at' => $dateTime,
        ]);
    }
}
