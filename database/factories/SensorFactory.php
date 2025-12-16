<?php

namespace Database\Factories;

use App\Models\Sensor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sensor>
 */
class SensorFactory extends Factory
{
    protected $model = Sensor::class;

    private array $jakartaLocations = [
        ['name' => 'Sensor Pintu Air Manggarai', 'lat' => -6.2095, 'lng' => 106.8503, 'address' => 'Pintu Air Manggarai, Menteng, Jakarta Pusat'],
        ['name' => 'Sensor Kali Ciliwung Kampung Melayu', 'lat' => -6.2256, 'lng' => 106.8646, 'address' => 'Kampung Melayu, Jatinegara, Jakarta Timur'],
        ['name' => 'Sensor Waduk Pluit', 'lat' => -6.1198, 'lng' => 106.7963, 'address' => 'Waduk Pluit, Penjaringan, Jakarta Utara'],
        ['name' => 'Sensor Kali Pesanggrahan', 'lat' => -6.2589, 'lng' => 106.7654, 'address' => 'Kali Pesanggrahan, Kebayoran Lama, Jakarta Selatan'],
        ['name' => 'Sensor Kali Sunter', 'lat' => -6.1456, 'lng' => 106.8912, 'address' => 'Kali Sunter, Tanjung Priok, Jakarta Utara'],
        ['name' => 'Sensor Waduk Ria Rio', 'lat' => -6.1876, 'lng' => 106.8789, 'address' => 'Waduk Ria Rio, Pulogadung, Jakarta Timur'],
        ['name' => 'Sensor Kali Krukut', 'lat' => -6.2345, 'lng' => 106.8234, 'address' => 'Kali Krukut, Tanah Abang, Jakarta Pusat'],
        ['name' => 'Sensor Kali Angke', 'lat' => -6.1567, 'lng' => 106.7432, 'address' => 'Kali Angke, Cengkareng, Jakarta Barat'],
        ['name' => 'Sensor Waduk Melati', 'lat' => -6.1723, 'lng' => 106.8567, 'address' => 'Waduk Melati, Kemayoran, Jakarta Pusat'],
        ['name' => 'Sensor Kali Mookervart', 'lat' => -6.1834, 'lng' => 106.7123, 'address' => 'Kali Mookervart, Kalideres, Jakarta Barat'],
    ];

    public function definition(): array
    {
        $location = $this->faker->randomElement($this->jakartaLocations);
        $waterLevel = $this->faker->randomFloat(2, 10, 180);
        $status = $this->calculateStatus($waterLevel);

        return [
            'name' => $location['name'],
            'code' => 'SNS-' . strtoupper($this->faker->unique()->bothify('??###')),
            'latitude' => $location['lat'] + $this->faker->randomFloat(4, -0.005, 0.005),
            'longitude' => $location['lng'] + $this->faker->randomFloat(4, -0.005, 0.005),
            'status' => $status,
            'water_level' => $waterLevel,
            'address' => $location['address'],
            'description' => 'Sensor pemantau ketinggian air di ' . $location['name'],
            'is_active' => $this->faker->boolean(90), // 90% active
            'last_reading_at' => $this->faker->dateTimeBetween('-1 hour', 'now'),
        ];
    }

    private function calculateStatus(float $waterLevel): string
    {
        if ($waterLevel <= 50) {
            return Sensor::STATUS_SAFE;
        } elseif ($waterLevel <= 100) {
            return Sensor::STATUS_WARNING;
        } else {
            return Sensor::STATUS_DANGER;
        }
    }

    public function safe(): static
    {
        return $this->state(fn(array $attributes) => [
            'water_level' => $this->faker->randomFloat(2, 10, 50),
            'status' => Sensor::STATUS_SAFE,
        ]);
    }

    public function warning(): static
    {
        return $this->state(fn(array $attributes) => [
            'water_level' => $this->faker->randomFloat(2, 51, 100),
            'status' => Sensor::STATUS_WARNING,
        ]);
    }

    public function danger(): static
    {
        return $this->state(fn(array $attributes) => [
            'water_level' => $this->faker->randomFloat(2, 101, 200),
            'status' => Sensor::STATUS_DANGER,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_active' => false,
        ]);
    }
}
