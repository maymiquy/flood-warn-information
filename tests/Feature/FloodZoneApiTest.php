<?php

namespace Tests\Feature;

use App\Models\FloodZone;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FloodZoneApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_flood_zones_list(): void
    {
        FloodZone::factory()->count(5)->create();

        $response = $this->getJson('/api/flood-zones');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data',
                'total',
                'stats',
            ])
            ->assertJson([
                'success' => true,
                'total' => 5,
            ]);
    }

    public function test_can_filter_flood_zones_by_risk_level(): void
    {
        FloodZone::factory()->count(3)->create(['risk_level' => FloodZone::RISK_LOW]);
        FloodZone::factory()->count(2)->create(['risk_level' => FloodZone::RISK_HIGH]);

        $response = $this->getJson('/api/flood-zones?risk_level=low');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_can_get_single_flood_zone(): void
    {
        $zone = FloodZone::factory()->create();

        $response = $this->getJson("/api/flood-zones/{$zone->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_can_create_flood_zone(): void
    {
        $zoneData = [
            'name' => 'New Flood Zone',
            'description' => 'Test description',
            'risk_level' => 'high',
            'coordinates' => [
                [-6.2, 106.8],
                [-6.3, 106.9],
                [-6.4, 106.7],
            ],
        ];

        $response = $this->postJson('/api/flood-zones', $zoneData);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Zona banjir berhasil ditambahkan.',
            ]);

        $this->assertDatabaseHas('flood_zones', [
            'name' => 'New Flood Zone',
            'risk_level' => 'high',
        ]);
    }

    public function test_flood_zone_creation_requires_name(): void
    {
        $zoneData = [
            'risk_level' => 'high',
            'coordinates' => [
                [-6.2, 106.8],
                [-6.3, 106.9],
                [-6.4, 106.7],
            ],
        ];

        $response = $this->postJson('/api/flood-zones', $zoneData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_flood_zone_creation_requires_coordinates(): void
    {
        $zoneData = [
            'name' => 'Test Zone',
            'risk_level' => 'high',
        ];

        $response = $this->postJson('/api/flood-zones', $zoneData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['coordinates']);
    }

    public function test_can_update_flood_zone(): void
    {
        $zone = FloodZone::factory()->create();

        $updateData = [
            'name' => 'Updated Zone Name',
            'risk_level' => 'medium',
            'coordinates' => $zone->coordinates,
        ];

        $response = $this->putJson("/api/flood-zones/{$zone->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Zona banjir berhasil diperbarui.',
            ]);

        $this->assertDatabaseHas('flood_zones', [
            'id' => $zone->id,
            'name' => 'Updated Zone Name',
            'risk_level' => 'medium',
        ]);
    }

    public function test_can_delete_flood_zone(): void
    {
        $zone = FloodZone::factory()->create();

        $response = $this->deleteJson("/api/flood-zones/{$zone->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Zona banjir berhasil dihapus.',
            ]);

        $this->assertDatabaseMissing('flood_zones', [
            'id' => $zone->id,
        ]);
    }

    public function test_can_get_polygons(): void
    {
        FloodZone::factory()->count(3)->create();

        $response = $this->getJson('/api/flood-zones/polygons');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data',
                'total',
            ]);
    }

    public function test_can_filter_polygons_by_risk_level(): void
    {
        FloodZone::factory()->count(2)->create(['risk_level' => FloodZone::RISK_LOW]);
        FloodZone::factory()->count(3)->create(['risk_level' => FloodZone::RISK_HIGH]);

        $response = $this->getJson('/api/flood-zones/polygons?risk_level=high');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }
}
