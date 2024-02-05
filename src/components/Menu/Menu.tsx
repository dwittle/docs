import { ReactElement } from 'react';
import { MenuItem } from './MenuItem';
import { Platform } from '@/data/platforms';
import { PageNode } from '@/directory/directory';
import { findDirectoryNode } from '@/utils/findDirectoryNode';
import { BUILD_A_BACKEND, PREV_BUILD_A_BACKEND } from '@/data/routes';

type MenuProps = {
  currentPlatform?: Platform;
  path: string;
};

const invalidChildren = [
  '/[platform]/prev',
  '/[platform]/tools/cli-legacy',
  '/[platform]/sdk'
];

export function Menu({ currentPlatform, path }: MenuProps): ReactElement {
  const isGen1 = path.split('/')[1] === 'gen1';
  const isPrev = path.split('/')[3] === 'prev';
  const isLegacy = path.split('/')[4] === 'cli-legacy';
  const isSDK = path.split('/')[3] === 'sdk';
  let rootMenuNode, childrenNodes, baseMenu;
  if (isLegacy) {
    rootMenuNode = {
      children: [findDirectoryNode('/[platform]/tools/cli-legacy')]
    };
    childrenNodes = rootMenuNode.children;
  } else if (isSDK) {
    rootMenuNode = { children: [findDirectoryNode('/[platform]/sdk')] };
    childrenNodes = rootMenuNode.children;
  } else if (isGen1) {
    rootMenuNode = findDirectoryNode('/gen1');
    childrenNodes = rootMenuNode.children;
  } else {
    baseMenu = true;
    rootMenuNode = findDirectoryNode('/[platform]');
    childrenNodes = rootMenuNode?.children?.filter((childNode) => {
      return (
        invalidChildren.indexOf(childNode.route) === -1 ||
        childNode.isUnfilterable
      );
    });
  }

  if (isPrev) {
    // replace build a backend with previous build a backend
    const buildABackend = findDirectoryNode(PREV_BUILD_A_BACKEND);
    childrenNodes = childrenNodes?.map((child) => {
      if (child.route === BUILD_A_BACKEND) {
        return buildABackend;
      }
      return child;
    });
  }

  return (
    <nav className="menu" aria-label="Main">
      <ul className="menu__list">
        {childrenNodes &&
          childrenNodes.map((child, index) => {
            return (
              <MenuItem
                key={index}
                pageNode={child as PageNode}
                parentSetOpen={null}
                level={1}
                hideChildren={child.hideChildrenOnBase && baseMenu}
                {...(currentPlatform
                  ? { currentPlatform: currentPlatform }
                  : {})}
              />
            );
          })}
      </ul>
    </nav>
  );
}
