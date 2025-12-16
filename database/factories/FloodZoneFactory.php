<?php

namespace Database\Factories;

use App\Models\FloodZone;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FloodZone>
 */
class FloodZoneFactory extends Factory
{
    protected $model = FloodZone::class;

    private array $floodZones = [
        [
            'name' => 'Zona Banjir Kampung Melayu',
            'description' => 'Area rawan banjir di sekitar Kampung Melayu, sering terdampak luapan Kali Ciliwung.',
            'risk_level' => 'high',
            'color' => '#ef4444',
            'coordinates' => [
                [-6.2200, 106.8600],
                [-6.2200, 106.8700],
                [-6.2300, 106.8700],
                [-6.2300, 106.8600],
                [-6.2200, 106.8600],
            ],
        ],
        [
            'name' => 'Zona Banjir Bidara Cina',
            'description' => 'Area rawan banjir di Bidara Cina, terdampak luapan Kali Ciliwung.',
            'risk_level' => 'high',
            'color' => '#ef4444',
            'coordinates' => [
                [-6.2280, 106.8560],
                [-6.2280, 106.8640],
                [-6.2350, 106.8640],
                [-6.2350, 106.8560],
                [-6.2280, 106.8560],
            ],
        ],
        [
            'name' => 'Zona Banjir Manggarai',
            'description' => 'Area sekitar Pintu Air Manggarai yang rawan terdampak banjir.',
            'risk_level' => 'medium',
            'color' => '#eab308',
            'coordinates' => [
                [-6.2050, 106.8450],
                [-6.2050, 106.8550],
                [-6.2130, 106.8550],
                [-6.2130, 106.8450],
                [-6.2050, 106.8450],
            ],
        ],
        [
            'name' => 'Zona Banjir Pluit',
            'description' => 'Area rawan banjir di sekitar Waduk Pluit, Jakarta Utara.',
            'risk_level' => 'medium',
            'color' => '#eab308',
            'coordinates' => [
                [-6.1150, 106.7900],
                [-6.1150, 106.8020],
                [-6.1250, 106.8020],
                [-6.1250, 106.7900],
                [-6.1150, 106.7900],
            ],
        ],
        [
            'name' => 'Zona Banjir Sunter',
            'description' => 'Area rawan banjir di sekitar Kali Sunter, Jakarta Utara.',
            'risk_level' => 'low',
            'color' => '#22c55e',
            'coordinates' => [
                [-6.1400, 106.8850],
                [-6.1400, 106.8970],
                [-6.1500, 106.8970],
                [-6.1500, 106.8850],
                [-6.1400, 106.8850],
            ],
        ],
    ];

    public function definition(): array
    {
        $zone = $this->faker->randomElement($this->floodZones);

        return [
            'name' => $zone['name'],
            'description' => $zone['description'],
            'coordinates' => $zone['coordinates'],
            'risk_level' => $zone['risk_level'],
            'color' => $zone['color'],
            'is_active' => true,
        ];
    }

    public function lowRisk(): static
    {
        return $this->state(fn(array $attributes) => [
            'risk_level' => FloodZone::RISK_LOW,
            'color' => '#22c55e',
        ]);
    }

    public function mediumRisk(): static
    {
        return $this->state(fn(array $attributes) => [
            'risk_level' => FloodZone::RISK_MEDIUM,
            'color' => '#eab308',
        ]);
    }

    public function highRisk(): static
    {
        return $this->state(fn(array $attributes) => [
            'risk_level' => FloodZone::RISK_HIGH,
            'color' => '#ef4444',
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_active' => false,
        ]);
    }
}
