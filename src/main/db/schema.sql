CREATE TABLE IF NOT EXISTS configuracoes (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  tarifa_kwh REAL NOT NULL DEFAULT 0.95,
  umidade_relativa REAL NOT NULL DEFAULT 60,
  tema TEXT NOT NULL DEFAULT 'system' CHECK (tema IN ('light', 'dark', 'system'))
);

INSERT OR IGNORE INTO configuracoes (id, tarifa_kwh, umidade_relativa, tema) VALUES (1, 0.95, 60, 'system');

CREATE TABLE IF NOT EXISTS salas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  comprimento REAL NOT NULL,
  largura REAL NOT NULL,
  altura REAL NOT NULL,
  num_pessoas INTEGER NOT NULL DEFAULT 0,
  num_eletronicos INTEGER NOT NULL DEFAULT 0,
  sol_direto INTEGER NOT NULL DEFAULT 0,
  tipo_ambiente TEXT NOT NULL DEFAULT 'padrao' CHECK (tipo_ambiente IN ('padrao', 'cozinha')),
  observacoes TEXT,
  btu_necessario REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS arcondicionados (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sala_id INTEGER NOT NULL REFERENCES salas (id) ON DELETE CASCADE,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  btu_instalado INTEGER NOT NULL,
  potencia_w REAL NOT NULL,
  horas_dia REAL NOT NULL,
  dias_mes INTEGER NOT NULL DEFAULT 22,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_arcondicionados_sala_id ON arcondicionados (sala_id);
