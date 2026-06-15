"use client";

import "leaflet/dist/leaflet.css";
import "./race-map.css";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import type { NormalizedRace } from "@/entities/race";
import { GlassCard } from "@/shared/ui";
import { formatDateShort } from "@/shared/lib/utils";
import { KR_CENTER, KR_DEFAULT_ZOOM } from "@/shared/lib/locations";
import { groupRacesByLocation } from "../model/groupByLocation";

interface RaceMapProps {
  races: NormalizedRace[];
  height?: number;
}

const DARK_TILES =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> · <a href="https://carto.com/attributions">CARTO</a>';

export function RaceMap({ races, height = 560 }: RaceMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  const { groups, unresolved } = useMemo(
    () => groupRacesByLocation(races),
    [races],
  );

  // 지도 1회 초기화
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: KR_CENTER,
      zoom: KR_DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: true,
      worldCopyJump: true,
    });

    L.tileLayer(DARK_TILES, {
      attribution: TILE_ATTR,
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // 마커 동기화
  useEffect(() => {
    if (!mapRef.current || !layerRef.current) return;
    const layer = layerRef.current;
    layer.clearLayers();

    for (const group of groups) {
      const count = group.races.length;
      const size = Math.min(56, 28 + Math.log2(count + 1) * 7);
      const icon = L.divIcon({
        className: "race-marker",
        html: `<span class="race-marker__pulse"></span><span class="race-marker__dot">${count}</span>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker(group.latLng, { icon });

      // 팝업 콘텐츠 (최대 5개 표시)
      const previewRaces = group.races.slice(0, 5);
      const more = group.races.length - previewRaces.length;
      const items = previewRaces
        .map((r) => {
          const date = r.startDate
            ? `<span class="race-popup__date">${escapeHtml(
                formatDateShort(r.startDate),
              )}</span>`
            : "";
          const events = r.events.length
            ? `<span class="race-popup__events">${escapeHtml(
                r.events.slice(0, 3).join(" · "),
              )}</span>`
            : "";
          const href = r.compUrl ?? "#";
          return `<a class="race-popup__item" href="${escapeHtml(href)}">
            <span class="race-popup__title">${escapeHtml(r.title)}</span>
            ${date}${events}
          </a>`;
        })
        .join("");

      const moreLine = more > 0
        ? `<div class="race-popup__more">외 ${more}개</div>`
        : "";

      marker.bindPopup(
        `<div class="race-popup">
           <div class="race-popup__head">
             <span class="race-popup__city">${escapeHtml(group.key)}</span>
             <span class="race-popup__count">${count}개</span>
           </div>
           <div class="race-popup__list">${items}</div>
           ${moreLine}
         </div>`,
        {
          maxWidth: 320,
          className: "race-popup-wrap",
          closeButton: true,
          autoPan: true,
        },
      );

      marker.addTo(layer);
    }

    // 마커가 있을 때 한국 영역으로 fit
    if (groups.length > 0) {
      const bounds = L.latLngBounds(groups.map((g) => g.latLng));
      mapRef.current.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 10,
        animate: true,
      });
    } else {
      mapRef.current.setView(KR_CENTER, KR_DEFAULT_ZOOM);
    }
  }, [groups]);

  return (
    <div className="space-y-3">
      <GlassCard className="overflow-hidden p-0">
        <div
          ref={containerRef}
          style={{ height }}
          className="w-full"
          role="application"
          aria-label="대회 위치 지도"
        />
      </GlassCard>
      <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--fg-subtle)]">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[var(--accent)]" />
          위치 확인 {groups.length}곳 · {races.length - unresolved.length}개 대회
        </span>
        {unresolved.length > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-white/30" />
            위치 미확인 {unresolved.length}개
          </span>
        )}
      </div>
    </div>
  );
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
