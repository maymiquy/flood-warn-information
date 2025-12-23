<?php

namespace Tests\Feature;

use App\Models\FloodZone;
use App\Models\Sensor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MapApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_access_map_page(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_can_get_map_data(): void
    {
        Sensor::factory()->count(3)->create();
        FloodZone::factory()->count(2)->create();

        $response = $this->getJson('/api/map/data');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data',
            ]);
    }

    public function test_can_filter_map_data_by_status(): void
    {
        Sensor::factory()->count(2)->create(['status' => Sensor::STATUS_SAFE]);
        Sensor::factory()->count(2)->create(['status' => Sensor::STATUS_DANGER]);

        $response = $this->getJson('/api/map/data?status=safe');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_can_get_sensors_list_for_sidebar(): void
    {
        Sensor::factory()->count(5)->create();

        $response = $this->getJson('/api/map/sensors');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data',
                'total',
            ]);
    }

    public function test_can_search_sensors_list(): void
    {
        Sensor::factory()->create(['name' => 'Sensor Jakarta']);
        Sensor::factory()->create(['name' => 'Sensor Bandung']);

        $response = $this->getJson('/api/map/sensors?search=Jakarta');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_can_get_zones_list_for_sidebar(): void
    {
        FloodZone::factory()->count(4)->create();

        $response = $this->getJson('/api/map/zones');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data',
                'total',
            ]);
    }

    public function test_can_filter_zones_list_by_risk_level(): void
    {
        FloodZone::factory()->count(2)->create(['risk_level' => FloodZone::RISK_LOW]);
        FloodZone::factory()->count(2)->create(['risk_level' => FloodZone::RISK_HIGH]);

        $response = $this->getJson('/api/map/zones?risk_level=high');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_can_get_dashboard_summary(): void
    {
        Sensor::factory()->count(5)->create();
        FloodZone::factory()->count(3)->create();

        $response = $this->getJson('/api/map/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data',
            ]);
    }

    public function test_map_page_includes_markers_and_polygons(): void
    {
        Sensor::factory()->count(3)->create();
        FloodZone::factory()->count(2)->create();

        $response = $this->get('/');

        $response->assertStatus(200)
            ->assertInertia(
                fn($page) => $page
                    ->component('Maps/Index')
                    ->has('markers')
                    ->has('polygons')
                    ->has('stats')
            );
    }
}
