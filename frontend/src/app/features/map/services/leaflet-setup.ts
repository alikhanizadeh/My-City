import * as L from "leaflet";

// این خط باید همیشه قبل از import شدن leaflet.markercluster و leaflet.heat
// اجرا بشه. این دو پلاگین دنبال window.L می‌گردن تا متدهاشون
// (markerClusterGroup, heatLayer) رو به همون نمونه از L اضافه کنن.
// بدون این خط، ممکنه یک کپی جداگانه از L بسازن که با نسخه‌ای که
// بقیه کد از آن استفاده می‌کند متفاوت است.
(window as any).L = L;

export { L };
