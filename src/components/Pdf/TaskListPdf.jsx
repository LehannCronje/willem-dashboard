import React, { useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {},
  taskParent: {
    fontWeight: "bold",
    fontSize: 50,
  },
  body: {
    padding: 10,
  },
  table: {
    display: "table",
    width: "auto",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderBottomWidth: 1,
  },
  tableColHeader: {
    width: "16.66%",
    color: "#fff",
    backgroundColor: "#00008b",
  },
  tableCol: {
    width: "16.66%",
  },
  parentTableCol: {
    width: "100%",
    backgroundColor: "#BCD2E8",
  },
  tableCellHeader: {
    width: "100%",
    margin: 5,
    fontSize: 12,
    fontWeight: 500,
  },
  tableCell: {
    margin: "auto",
    margin: 5,
    fontSize: 10,
  },
  tableHeader: {
    flexDirection: "row",
    border: "none",
  },
  pageNumberStyle: {
    flexDirection: "row",
    width: "33.33%",
    justifyContent: "flex-end",
    fontSize: 5,
  },
  fileNameStyle: {
    flexDirection: "row",
    justifyContent: "center",
    width: "33.33%",
  },
  logoStyle: {
    flexDirection: "row",
    width: "33.33%",
    justifyContent: "flex-start",
  },
  nameStyle: {
    flexDirection: "row",
    width: "50%",
    justifyContent: "flex-start",
  },
  dateStyle: {
    flexDirection: "row",
    width: "50%",
    justifyContent: "flex-end",
  },
});

export function PdfDocument(props) {
  return (
    <Document>
      <Page wrap orientation={"landscape"} style={styles.page}>
        <View style={styles.body}>
          <View style={styles.tableHeader} fixed>
            <View style={styles.logoStyle}>
              <Text>Logo</Text>
            </View>
            <View style={styles.fileNameStyle}>
              <Text>Title</Text>
            </View>
            <View style={styles.pageNumberStyle}>
              <Text
                render={({ pageNumber, totalPages }) =>
                  `${pageNumber} / ${totalPages}`
                }
                fixed
              />
            </View>
          </View>
          <View style={styles.tableHeader} fixed>
            <View style={styles.nameStyle}>
              <Text>Name: </Text>
            </View>
            <View style={styles.dateStyle}>
              <Text>Date:</Text>
            </View>
          </View>
          <View style={styles.tableRow} fixed>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>ID</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Name</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Duration Complete</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Start</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Finish</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Notes</Text>
            </View>
          </View>
          <View style={styles.table}></View>
          {props.data
            ? props.data.map((parentTask, i) => {
                return (
                  <View key={i}>
                    <View style={styles.tableRow} break>
                      <View style={styles.parentTableCol}>
                        <Text style={styles.tableCell}>{parentTask.name}</Text>
                      </View>
                    </View>
                    {parentTask.tasks.map((task, j) => {
                      return (
                        <View key={j} style={styles.tableRow} break>
                          <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{task.id}</Text>
                          </View>
                          <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{task.name}</Text>
                          </View>
                          <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>
                              {task.duration}
                            </Text>
                          </View>
                          <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{task.start}</Text>
                          </View>
                          <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{task.finish}</Text>
                          </View>
                          <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{task.notes}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                );
              })
            : "empty"}
        </View>
      </Page>
    </Document>
  );
}
