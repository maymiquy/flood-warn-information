<?php

namespace Tests\Unit;

use App\Models\FloodZone;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FloodZoneTest extends TestCase
{
    use RefreshDatabase;

    public function test_flood_zone_can_be_created(): void
    {
        $zone = FloodZone::factory()->create([
            'name' => 'Test Zone',
            'risk_level' => FloodZone::RISK_HIGH,
        ]);

        $this->assertDatabaseHas('flood_zones', [
            'name' => 'Test Zone',
            'risk_level' => 'high',
        ]);
    }

    public function test_flood_zone_has_correct_risk_color(): void
    {
        $lowZone = FloodZone::factory()->create(['risk_level' => FloodZone::RISK_LOW]);
        $mediumZone = FloodZone::factory()->create(['risk_level' => FloodZone::RISK_MEDIUM]);
        $highZone = FloodZone::factory()->create(['risk_level' => FloodZone::RISK_HIGH]);

        $this->assertEquals('#22c55e', $lowZone->risk_color);
        $this->assertEquals('#eab308', $mediumZone->risk_color);
        $this->assertEquals('#ef4444', $highZone->risk_color);
    }

    public function test_flood_zone_has_correct_risk_label(): void
    {
        $lowZone = FloodZone::factory()->create(['risk_level' => FloodZone::RISK_LOW]);
        $mediumZone = FloodZone::factory()->create(['risk_level' => FloodZone::RISK_MEDIUM]);
        $highZone = FloodZone::factory()->create(['risk_level' => FloodZone::RISK_HIGH]);

        $this->assertEquals('Rendah', $lowZone->risk_label);
        $this->assertEquals('Sedang', $mediumZone->risk_label);
        $this->assertEquals('Tinggi', $highZone->risk_label);
    }

    public function test_flood_zone_has_correct_opacity(): void
    {
        $lowZone = FloodZone::factory()->create(['risk_level' => FloodZone::RISK_LOW]);
        $mediumZone = FloodZone::factory()->create(['risk_level' => FloodZone::RISK_MEDIUM]);
        $highZone = FloodZone::factory()->create(['risk_level' => FloodZone::RISK_HIGH]);

        $this->assertEquals(0.3, $lowZone->opacity);
        $this->assertEquals(0.4, $mediumZone->opacity);
        $this->assertEquals(0.5, $highZone->opacity);
    }

    public function test_flood_zone_active_scope(): void
    {
        FloodZone::factory()->count(4)->create(['is_active' => true]);
        FloodZone::factory()->count(2)->create(['is_active' => false]);

        $activeZones = FloodZone::active()->get();

        $this->assertCount(4, $activeZones);
    }

    public function test_flood_zone_by_risk_level_scope(): void
    {
        FloodZone::factory()->count(2)->create(['risk_level' => FloodZone::RISK_LOW]);
        FloodZone::factory()->count(3)->create(['risk_level' => FloodZone::RISK_MEDIUM]);
        FloodZone::factory()->count(1)->create(['risk_level' => FloodZone::RISK_HIGH]);

        $lowZones = FloodZone::byRiskLevel(FloodZone::RISK_LOW)->get();
        $mediumZones = FloodZone::byRiskLevel(FloodZone::RISK_MEDIUM)->get();
        $highZones = FloodZone::byRiskLevel(FloodZone::RISK_HIGH)->get();

        $this->assertCount(2, $lowZones);
        $this->assertCount(3, $mediumZones);
        $this->assertCount(1, $highZones);
    }

    public function test_flood_zone_coordinates_cast_to_array(): void
    {
        $coordinates = [
            [-6.2, 106.8],
            [-6.3, 106.9],
            [-6.4, 106.7],
        ];

        $zone = FloodZone::factory()->create([
            'coordinates' => $coordinates,
        ]);

        $zone->refresh();

        $this->assertIsArray($zone->coordinates);
        $this->assertCount(3, $zone->coordinates);
    }

    public function test_flood_zone_is_active_cast_to_boolean(): void
    {
        $zone = FloodZone::factory()->create(['is_active' => true]);

        $this->assertIsBool($zone->is_active);
        $this->assertTrue($zone->is_active);
    }
}
