import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ClinicalData } from "@/lib/types";

const fontPath = typeof window === "undefined" ? "public/fonts" : "/fonts";

Font.register({
  family: "AarogyaInter",
  fonts: [
    { src: `${fontPath}/inter-regular.woff`, fontWeight: 400 },
    { src: `${fontPath}/inter-bold.woff`, fontWeight: 700 },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: { paddingTop: 82, paddingHorizontal: 48, paddingBottom: 62, fontFamily: "AarogyaInter", fontSize: 10.5, color: "#263a35", lineHeight: 1.48 },
  header: { position: "absolute", top: 30, left: 48, right: 48, paddingBottom: 13, borderBottomWidth: 1, borderBottomColor: "#d9e5df", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  brand: { fontSize: 17, fontWeight: 700, color: "#244f45" },
  documentTitle: { marginTop: 3, fontSize: 10, color: "#71857d" },
  date: { fontSize: 9.5, color: "#5d7169" },
  sectionTitle: { marginTop: 7, marginBottom: 13, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: "#d9e5df", color: "#326b5b", fontSize: 10, fontWeight: 700, letterSpacing: 0 },
  field: { marginBottom: 11 },
  fieldLabel: { marginBottom: 3, fontSize: 9, fontWeight: 700, color: "#4b6d61" },
  fieldValue: { fontSize: 10.5, lineHeight: 1.5, color: "#263a35" },
  medicine: { marginBottom: 8, flexDirection: "row", alignItems: "flex-start" },
  medicineNumber: { width: 19, fontSize: 10.5, fontWeight: 700, color: "#477b6d" },
  medicineText: { flex: 1, fontSize: 10.5, lineHeight: 1.5 },
  rxSection: { marginTop: 9 },
  rxBox: { marginBottom: 8, padding: 10, borderWidth: 1, borderColor: "#dfe9e4", borderRadius: 4, backgroundColor: "#fbfdfc" },
  rxName: { marginBottom: 4, fontSize: 10.5, fontWeight: 700, color: "#315e51" },
  rxDetails: { fontSize: 9.5, lineHeight: 1.45, color: "#4a6058" },
  footer: { marginTop: 18, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#d9e5df", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  disclaimer: { maxWidth: 435, fontSize: 8, color: "#687b73" },
  pageNumber: { fontSize: 8, color: "#87968f" },
});

function Field({ label, children }: { label: string; children: string }) {
  return <View style={styles.field} minPresenceAhead={35}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <Text style={styles.fieldValue}>{children.trim() || "Not mentioned"}</Text>
  </View>;
}

export function ClinicalNotePdf({ data, dateLabel }: { data: ClinicalData; dateLabel: string }) {
  return <Document title="AarogyaNote - Clinical Note" author="AarogyaNote">
    <Page size="A4" style={styles.page} wrap>
      <View style={styles.header} fixed>
        <View><Text style={styles.brand}>AarogyaNote</Text><Text style={styles.documentTitle}>Clinical Note</Text></View>
        <Text style={styles.date}>{dateLabel}</Text>
      </View>

      <Text style={styles.sectionTitle} minPresenceAhead={65}>VISIT SUMMARY</Text>
      <Field label="Chief Complaint">{data.chief_complaint}</Field>
      <Field label="History of Present Illness">{data.history_of_present_illness}</Field>
      <Field label="Examination Findings">{data.examination_findings}</Field>
      <Field label="Provisional Diagnosis">{data.provisional_diagnosis}</Field>
      <View style={styles.field} minPresenceAhead={35}>
        <Text style={styles.fieldLabel}>Medicines</Text>
        {data.medicines.length ? data.medicines.map((medicine, index) => (
          <View key={`${medicine.name}-${index}`} style={styles.medicine}>
            <Text style={styles.medicineNumber}>{index + 1}.</Text>
            <Text style={styles.medicineText}>{[medicine.name, medicine.dosage, medicine.frequency, medicine.duration].filter(Boolean).join("  |  ") || "Not specified"}</Text>
          </View>
        )) : <Text style={styles.fieldValue}>Not mentioned</Text>}
      </View>
      <Field label="Advice">{data.advice}</Field>
      <Field label="Follow-up">{data.follow_up}</Field>

      <View style={styles.rxSection}>
        <Text style={styles.sectionTitle} minPresenceAhead={65}>DRAFT PRESCRIPTION</Text>
        {data.medicines.length ? data.medicines.map((medicine, index) => (
          <View key={`rx-${medicine.name}-${index}`} style={styles.rxBox} wrap={false}>
            <Text style={styles.rxName}>{index + 1}. {medicine.name || "Medicine"}</Text>
            <Text style={styles.rxDetails}>Dosage: {medicine.dosage || "Not specified"}  |  Frequency: {medicine.frequency || "Not specified"}  |  Duration: {medicine.duration || "Not specified"}</Text>
          </View>
        )) : <Text style={styles.fieldValue}>No medicines were specified in the conversation.</Text>}
      </View>

      <View style={styles.footer}>
        <Text style={styles.disclaimer}>This is an AI-assisted draft. Verify all details before saving or prescribing.</Text>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </View>
    </Page>
  </Document>;
}
