<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFloodZoneRequest;
use App\Http\Requests\UpdateFloodZoneRequest;
use App\Models\FloodZone;
use App\Services\FloodZoneService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FloodZoneController extends Controller
{
    public function __construct(
        protected FloodZoneService $floodZoneService
    ) {}

    public function apiIndex(Request $request): JsonResponse
    {
        $filters = [
            'risk_level' => $request->input('risk_level', 'all'),
            'search' => $request->input('search'),
        ];

        $zones = $this->floodZoneService->getZonesFiltered($filters);

        return response()->json([
            'success' => true,
            'data' => $zones,
            'total' => count($zones),
            'stats' => $this->floodZoneService->getStatistics(),
        ]);
    }

    public function apiShow(FloodZone $floodZone): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->floodZoneService->formatZoneAsPolygon($floodZone),
        ]);
    }

    public function apiStore(StoreFloodZoneRequest $request): JsonResponse
    {
        $zone = $this->floodZoneService->createZone($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Zona banjir berhasil ditambahkan.',
            'data' => $this->floodZoneService->formatZoneAsPolygon($zone),
        ], 201);
    }

    public function apiUpdate(UpdateFloodZoneRequest $request, FloodZone $floodZone): JsonResponse
    {
        $zone = $this->floodZoneService->updateZone($floodZone, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Zona banjir berhasil diperbarui.',
            'data' => $this->floodZoneService->formatZoneAsPolygon($zone),
        ]);
    }

    public function apiDestroy(FloodZone $floodZone): JsonResponse
    {
        $this->floodZoneService->deleteZone($floodZone);

        return response()->json([
            'success' => true,
            'message' => 'Zona banjir berhasil dihapus.',
        ]);
    }

    public function getPolygons(Request $request): JsonResponse
    {
        $riskLevel = $request->input('risk_level');
        $polygons = $this->floodZoneService->getPolygonsForMap($riskLevel);

        return response()->json([
            'success' => true,
            'data' => $polygons,
            'total' => count($polygons),
        ]);
    }
}
