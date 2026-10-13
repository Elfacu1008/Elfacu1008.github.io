# Cómo está organizado el servidor de integraciones

```
integraciones/
  index.json          <- catálogo (lo genera herramientas/catalogo.mjs)
  index.json.sig      <- firma del catálogo (opcional)
  oficial/            <- integraciones hechas por NIVA
  comunidad/          <- integraciones de la comunidad (más adelante, revisadas antes de publicarse)
```

Una integración es un archivo `.json` chico (menos de 60 KB) que NIVA **lee como datos**. No contiene código: no puede ejecutar nada ni mandar información a ningún lado.

## Campos de una integración
| Campo | Qué es |
|---|---|
| `id` | Minúsculas, números y guiones. Tiene que coincidir con el del catálogo. |
| `name`, `desc`, `ver`, `offline` | Nombre, descripción, versión (subila al cambiar algo) y si funciona sin internet. |
| `sources` | Lista de orígenes. Para "Transferencia de notas", cada uno es una app de la que se pasan notas. |

## Campos de cada origen (`sources`)
| Campo | Qué es |
|---|---|
| `key`, `name`, `desc` | Identificador corto y texto que ve el usuario. |
| `accept` | Tipos de archivo que se pueden elegir, por ejemplo `.zip,.json`. |
| `help` | Hasta 8 frases con los pasos para conseguir el archivo en la otra app. |
| `type` | `json`, `csv` o `text`. |
| `map` | Dónde está cada dato: `title`, `body`, `folder`, `labels`, `date`, `trashed` y `list` (`path`, `text`, `checked`). Se escribe con puntos (`labels.*.name`). |
| `items` | (json) Dónde está la lista de notas dentro del archivo. Vacío si cada archivo es una nota. |
| `dateUnit` | `usec`, `sec` o `ms`. |
| `folders` | (text) `path` para usar las carpetas del .zip como carpetas de NIVA. |
| `bodyHtml` | `true` si el texto viene en HTML (se limpia antes de importar). |

## Publicar o actualizar
1. Subí el `.json` a `oficial/`.
2. Ejecutá `node herramientas/catalogo.mjs` (recalcula las huellas SHA-256 de `index.json`) y subí el `index.json` nuevo.
3. Si usás firma: `node herramientas/catalogo.mjs firmar` y subí también `index.json.sig`.

**Si editás una integración directamente en GitHub sin recalcular el catálogo, la app la rechaza**: la huella ya no coincide. Es a propósito.
