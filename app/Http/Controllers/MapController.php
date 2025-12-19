<?php

namespace App\Http\Controllers;

use App\Services\MapDataService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MapController extends Controller
{
    public function __construct(
        protected MapDataService $mapDataService
    ) {}

    public function index(): Response
    {
        $mapData = $this->mapDataService->getInitialMapData();
        $center = $this->mapDataService->getMapCenter();
        $bounds = $this->mapDataService->getMapBounds();

        return Inertia::render('Maps/Index', [
            'markers' => $mapData['markers'],
            'polygons' => $mapData['polygons'],
            'stats' => $mapData['stats'],
            'center' => $center,
            'bounds' => $bounds,
        ]);
    }

    public function getMapData(Request $request): JsonResponse
    {
        $status = $request->input('status');
        $riskLevel = $request->input('risk_level');

        $mapData = $this->mapDataService->getFilteredMapData($status, $riskLevel);

        return response()->json([
            'success' => true,
            'data' => $mapData,
        ]);
    }

    public function getSensorsList(Request $request): JsonResponse
    {
        $status = $request->input('status');
        $search = $request->input('search');

        $list = $this->mapDataService->getSensorsList($status, $search);

        return response()->json([
            'success' => true,
            'data' => $list,
            'total' => count($list),
        ]);
    }

    public function getZonesList(Request $request): JsonResponse
    {
        $riskLevel = $request->input('risk_level');
        $search = $request->input('search');

        $list = $this->mapDataService->getZonesList($riskLevel, $search);

        return response()->json([
            'success' => true,
            'data' => $list,
            'total' => count($list),
        ]);
    }

    public function getDashboardSummary(): JsonResponse
    {
        $summary = $this->mapDataService->getDashboardSummary();

        return response()->json([
            'success' => true,
            'data' => $summary,
        ]);
    }
}
