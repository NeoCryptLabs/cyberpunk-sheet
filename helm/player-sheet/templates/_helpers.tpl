{{/*
Expand the name of the chart.
*/}}
{{- define "player-sheet.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "player-sheet.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "player-sheet.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "player-sheet.labels" -}}
helm.sh/chart: {{ include "player-sheet.chart" . }}
{{ include "player-sheet.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "player-sheet.selectorLabels" -}}
app.kubernetes.io/name: {{ include "player-sheet.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
MongoDB URI
*/}}
{{- define "player-sheet.mongodbUri" -}}
mongodb://{{ .Values.mongodb.rootUser }}:{{ .Values.secrets.mongodbRootPassword }}@{{ include "player-sheet.fullname" . }}-mongodb:27017/{{ .Values.mongodb.database }}?authSource=admin
{{- end }}
