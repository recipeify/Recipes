import React from 'react';
import { Stack, StackItem } from '@patternfly/react-core';
import IngredientSearch from './IngredientSearch';

const Sidebar = () => (
  <Stack
    gutter="md"
  >
    <StackItem>
      <IngredientSearch include />
    </StackItem>
  </Stack>
);

export default Sidebar;
