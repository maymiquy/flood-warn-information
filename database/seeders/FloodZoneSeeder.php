<?php

namespace Database\Seeders;

use App\Models\FloodZone;
use Illuminate\Database\Seeder;

class FloodZoneSeeder extends Seeder
{
    private array $floodZones = [
        [
            'name' => 'Zona Banjir Kampung Melayu',
            'description' => 'Area rawan banjir tingkat tinggi di sekitar Kampung Melayu. Sering terdampak luapan Kali Ciliwung terutama saat musim hujan. Warga diharapkan waspada dan siap evakuasi.',
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
            'description' => 'Area rawan banjir di Bidara Cina, terdampak langsung oleh luapan Kali Ciliwung. Ketinggian banjir bisa mencapai 1-2 meter saat puncak hujan.',
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
            'description' => 'Area sekitar Pintu Air Manggarai yang rawan terdampak banjir saat kapasitas pintu air terlampaui. Pemantauan intensif dilakukan di zona ini.',
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
            'description' => 'Area rawan banjir di sekitar Waduk Pluit, Jakarta Utara. Rawan terdampak saat waduk meluap atau terjadi rob (banjir pasang air laut).',
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
            'description' => 'Area rawan banjir di sekitar Kali Sunter, Jakarta Utara. Tingkat risiko rendah namun tetap perlu diwaspadai saat curah hujan tinggi.',
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

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->floodZones as $zoneData) {
            FloodZone::create([
                ...$zoneData,
                'is_active' => true,
            ]);
        }

        $this->command->info('✅ Success');
    }
}
