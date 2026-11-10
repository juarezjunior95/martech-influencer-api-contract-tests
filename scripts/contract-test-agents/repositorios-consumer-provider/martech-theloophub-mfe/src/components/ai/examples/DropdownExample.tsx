import { Dropdown } from '../components/atoms/Dropdown';
import { Delete, Edit } from '../components/atoms/Icon';
import { Sandbox } from '../components/organisms/Sandbox';

export const DropdownExample = () => {
  return (
    <Sandbox title="Dropdown" description="Menu de ações contextual">
      <div style={{ display: 'flex', gap: 24 }}>
        <Dropdown>
          {({ open, toggle }) => (
            <>
              <Dropdown.Trigger
                open={open}
                onClick={toggle}
                icon={
                  <span
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #ccc',
                      borderRadius: 4,
                      background: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    Actions ▾
                  </span>
                }
                aria-label="Open actions menu"
              />
              <Dropdown.Menu open={open} onClose={toggle}>
                <Dropdown.Item icon={<Edit size={15} color="#5C5C5C" />}>
                  Rename
                </Dropdown.Item>
                <Dropdown.Item
                  icon={<Delete size={15} color="#D62222" />}
                  destructive
                >
                  Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </>
          )}
        </Dropdown>
      </div>
    </Sandbox>
  );
};
