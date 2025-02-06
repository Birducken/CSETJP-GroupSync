import { View, StyleSheet, Text } from 'react-native'

import * as Tasks from '@/services/tasks'
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useState } from 'react';
import { Checkbox } from 'react-native-paper';

type Props = {
  task: Tasks.Task,
}

export const TaskView = ({ task }: Props) => {
  const [checked, setChecked] = useState(false);

  return (
    <View style={styles.taskViewContainer}>
      <View style={styles.boxContainer}>
        <View style ={styles.titleRow}>
          <Checkbox status={checked ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked(!checked);
              }}
            />
          <Text style={styles.textTitle}>{task.title}</Text>
          <Text style={styles.textDate}>Due: {new Date(task.dueDate).toLocaleDateString()}</Text>
        </View>
        <View> 
          <Text style={styles.textDescription}>{task.description}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  taskViewContainer: {
    marginVertical: 10,
    width: '100%'
  },
  boxContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: useThemeColor("backgroundSecondary"),
    borderRadius: 8,
    borderColor: useThemeColor("highlight"),
    borderWidth: 4,
    padding: 12,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  textDate: {
    color: useThemeColor("textPrimary"),
    fontSize: 20,
  },
  textTitle: {
    color: useThemeColor("textPrimary"),
    fontSize: 24,
  },
  textDescription: {
    color:useThemeColor("textSecondary"),
    fontSize: 20,
  }
});