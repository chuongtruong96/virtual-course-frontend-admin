import PropTypes from 'prop-types';
import React, { createContext, useReducer } from 'react';
import * as actionType from '../store/actions';
import { CONFIG } from '../config/constant';

// Trạng thái mặc định
const initialState = {
  ...CONFIG,
  isOpen: [],
  isTrigger: []
};

// Tạo Context
export const ConfigContext = createContext(initialState);
const { Provider } = ConfigContext;

/**
 * Tạo Provider (Named Export)
 */
export const ConfigProvider = ({ children }) => {
  const [state, dispatch] = useReducer((currState, action) => {
    let trigger = [];
    let open = [];

    switch (action.type) {
      case actionType.CHANGE_LAYOUT:
        return {
          ...currState,
          layout: action.layout
        };
      case actionType.COLLAPSE_MENU:
        return {
          ...currState,
          collapseMenu: !currState.collapseMenu
        };
      case actionType.COLLAPSE_TOGGLE:
        if (action.menu?.type === 'sub') {
          open = currState.isOpen;
          trigger = currState.isTrigger;

          const triggerIndex = trigger.indexOf(action.menu.id);
          if (triggerIndex > -1) {
            // Đã tồn tại => remove
            open = open.filter((item) => item !== action.menu.id);
            trigger = trigger.filter((item) => item !== action.menu.id);
          } else {
            // Chưa có => thêm
            open = [...open, action.menu.id];
            trigger = [...trigger, action.menu.id];
          }
        } else {
          open = currState.isOpen;
          const triggerIndex = currState.isTrigger.indexOf(action.menu.id);
          trigger = triggerIndex === -1 ? [action.menu.id] : [];
          open = triggerIndex === -1 ? [action.menu.id] : [];
        }
        return {
          ...currState,
          isOpen: open,
          isTrigger: trigger
        };
      case actionType.NAV_COLLAPSE_LEAVE:
        if (action.menu?.type === 'sub') {
          open = currState.isOpen;
          trigger = currState.isTrigger;

          const idx = trigger.indexOf(action.menu.id);
          if (idx > -1) {
            open = open.filter((item) => item !== action.menu.id);
            trigger = trigger.filter((item) => item !== action.menu.id);
          }
          return {
            ...currState,
            isOpen: open,
            isTrigger: trigger
          };
        }
        return { ...currState };

      case actionType.NAV_CONTENT_LEAVE:
        return {
          ...currState,
          isOpen: open,
          isTrigger: trigger
        };

      case actionType.RESET:
        return {
          ...currState,
          layout: initialState.layout,
          collapseMenu: initialState.collapseMenu
        };

      default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

ConfigProvider.propTypes = {
  children: PropTypes.node
};
// Export default chính là hàm Provider
export default ConfigProvider;
