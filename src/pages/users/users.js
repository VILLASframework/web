import { useState } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownButton, Spinner, Row, Col } from "react-bootstrap";
import {
  Table,
  ButtonColumn,
  CheckboxColumn,
  DataColumn,
} from "../../common/table";
import Icon from "../../common/icon";
import IconButton from "../../common/buttons/icon-button";
import NewUserDialog from "./dialogs/new-user";
import EditUserDialog from "./dialogs/edit-user";
import UsersToScenarioDialog from "./dialogs/users-to-scenario";
import DeleteDialog from "../../common/dialogs/delete-dialog";
import { buttonStyle, iconStyle } from "./styles";
import NotificationsFactory from "../../common/data-managers/notifications-factory";
import notificationsDataManager from "../../common/data-managers/notifications-data-manager";
import Usergroups from "../usergroups/usergroups";
import {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetScenariosQuery,
  useAddUserToScenarioMutation,
  useGetUsergroupsQuery,
  useAddUserToUsergroupMutation,
} from "../../store/apiSlice";

const Users = () => {
  const { user: currentUser, token: sessionToken } = useSelector(
    (state) => state.auth
  );

  const { data: fetchedUsers, refetch: refetchUsers } = useGetUsersQuery();
  const users = fetchedUsers ? fetchedUsers.users : [];
  const { data: { scenarios } = [], isLoading: isLoadingScenarios } =
    useGetScenariosQuery();
  const { data: { usergroups } = [], isLoading: isLoadingUsergroups } =
    useGetUsergroupsQuery();
  const [checkedUsersIDs, setCheckedUsersIDs] = useState([]);
  const [addUserMutation] = useAddUserMutation();
  const [updateUserMutation] = useUpdateUserMutation();
  const [deleteUserMutation] = useDeleteUserMutation();
  const [addUserToScenarioMutation] = useAddUserToScenarioMutation();
  const [addUserToUsergroup] = useAddUserToUsergroupMutation();
  const [isNewModalOpened, setIsNewModalOpened] = useState(false);
  const [isEditModalOpened, setIsEditModalOpened] = useState(false);
  const [isDeleteModalOpened, setIsDeleteModalOpened] = useState(false);
  const [scenario, setScenario] = useState({ name: "" });
  const [usergroup, setUsergroup] = useState({ name: "" });
  const [isUsersToScenarioModalOpened, setUsersToScenarioModalOpened] =
    useState(false);
  const [isUsersToUsegroupModalOpened, setUsersToUsegroupModalOpened] =
    useState(false);
  const [userToEdit, setUserToEdit] = useState({});
  const [userToDelete, setUserToDelete] = useState({});
  const [areAllUsersChecked, setAreAllUsersChecked] = useState(false);

  const handleAddNewUser = async (data) => {
    if (data) {
      try {
        const res = await addUserMutation({ user: data });
        if (res.error) {
          notificationsDataManager.addNotification(
            NotificationsFactory.LOAD_ERROR(res.error.data.message)
          );
        }
        refetchUsers();
      } catch (error) {
        if (error.data) {
          notificationsDataManager.addNotification(
            NotificationsFactory.LOAD_ERROR(error.data.message)
          );
        } else {
          notificationsDataManager.addNotification(
            NotificationsFactory.LOAD_ERROR("Unknown error")
          );
        }
      }
    }

    setIsNewModalOpened(false);
  };

  const getIconForActiveColumn = (active) => {
    return <Icon icon={active ? "check" : "times"} />;
  };

  const handleEditUser = async (data) => {
    if (data) {
      try {
        await updateUserMutation(data);
        refetchUsers();
      } catch (error) {
        if (error.data) {
          notificationsDataManager.addNotification(
            NotificationsFactory.LOAD_ERROR(error.data.message)
          );
        } else {
          notificationsDataManager.addNotification(
            NotificationsFactory.LOAD_ERROR("Unknown error")
          );
        }
      }
    }

    refetchUsers();
    setIsEditModalOpened(false);
    setUserToEdit({});
  };

  const handleDeleteUser = async (isConfimed) => {
    if (isConfimed) {
      try {
        await deleteUserMutation(userToDelete.id);
      } catch (error) {
        if (error.data) {
          notificationsDataManager.addNotification(
            NotificationsFactory.LOAD_ERROR(error.data.message)
          );
        } else {
          notificationsDataManager.addNotification(
            NotificationsFactory.LOAD_ERROR("Unknown error")
          );
        }
      }
    }

    refetchUsers();
    setIsDeleteModalOpened(false);
    setUserToDelete({});
  };

  const handleAddUserToScenario = async (isCanceled) => {
    if (!isCanceled) {
      try {
        for (let i = 0; i < checkedUsersIDs.length; i++) {
          await addUserToScenarioMutation({
            scenarioID: scenario.id,
            username: users.find((u) => u.id === checkedUsersIDs[i]).username,
          }).unwrap();
        }
      } catch (error) {
        if (error.data) {
          notificationsDataManager.addNotification(
            NotificationsFactory.LOAD_ERROR(error.data.message)
          );
        } else {
          notificationsDataManager.addNotification(
            NotificationsFactory.LOAD_ERROR("Unknown error")
          );
        }
      }
    }

    setUsersToScenarioModalOpened(false);
    setCheckedUsersIDs([]);
    setScenario({ name: "" });
    setAreAllUsersChecked(false);
  };

  const handleAddUsersToUsergroup = async (isCanceled) => {
    if (!isCanceled) {
      try {
        for (let i = 0; i < checkedUsersIDs.length; i++) {
          await addUserToUsergroup({
            usergroupID: usergroup.id,
            username: users.find((u) => u.id === checkedUsersIDs[i]).username,
          }).unwrap();
        }
      } catch (error) {
        if (error.data) {
          notificationsDataManager.addNotification(
            NotificationsFactory.LOAD_ERROR(error.data.message)
          );
        } else {
          notificationsDataManager.addNotification(
            NotificationsFactory.LOAD_ERROR("Unknown error")
          );
        }
      }
    }

    setUsersToUsegroupModalOpened(false);
    setCheckedUsersIDs([]);
    setUsergroup({ name: "" });
    setAreAllUsersChecked(false);
  };

  const toggleCheckAllUsers = () => {
    if (checkedUsersIDs.length === users.length) {
      setCheckedUsersIDs([]);
      setAreAllUsersChecked(false);
    } else {
      users.forEach((user) => {
        if (!checkedUsersIDs.includes(user.id)) {
          setCheckedUsersIDs((prevState) => [...prevState, user.id]);
        }
      });
      setAreAllUsersChecked(true);
    }
  };

  const isUserChecked = (user) => {
    return checkedUsersIDs.includes(user.id);
  };

  const handleUserCheck = (user, event) => {
    if (!checkedUsersIDs.includes(user.id)) {
      setCheckedUsersIDs((prevState) => [...prevState, user.id]);
    } else {
      const index = checkedUsersIDs.indexOf(user.id);
      setCheckedUsersIDs((prevState) =>
        prevState.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <div>
      <h1>
        Users
        <span className="icon-button">
          <IconButton
            childKey={0}
            tooltip="Add User"
            onClick={() => setIsNewModalOpened(true)}
            icon="plus"
            buttonStyle={buttonStyle}
            iconStyle={iconStyle}
          />
        </span>
      </h1>

      <Table data={users} allRowsChecked={areAllUsersChecked}>
        {currentUser.role === "Admin" ? (
          <DataColumn title="ID" dataKey="id" />
        ) : (
          <></>
        )}
        {currentUser.role === "Admin" ? (
          <CheckboxColumn
            enableCheckAll
            onCheckAll={() => toggleCheckAllUsers()}
            allChecked={areAllUsersChecked}
            checked={(user) => isUserChecked(user)}
            onChecked={(user, event) => handleUserCheck(user, event)}
            width="30"
          />
        ) : (
          <></>
        )}
        <DataColumn title="Username" width="150" dataKey="username" />
        <DataColumn title="E-mail" dataKey="mail" />
        <DataColumn title="Role" dataKey="role" />
        <DataColumn
          title="Active"
          dataKey="active"
          modifier={(active) => getIconForActiveColumn(active)}
        />
        <ButtonColumn
          width="200"
          align="right"
          editButton
          deleteButton
          onEdit={(index) => {
            setIsEditModalOpened(true);
            setUserToEdit(users[index]);
          }}
          onDelete={(index) => {
            setIsDeleteModalOpened(true);
            setUserToDelete(users[index]);
          }}
        />
      </Table>

      <Row>
        <Col md="auto">
          {isLoadingScenarios ? (
            <Spinner />
          ) : (
            <>
              <span className="solid-button">
                <DropdownButton
                  title="Add to Scenario"
                  onSelect={(id) => {
                    let scenario;
                    if (scenarios.length > 0) {
                      scenario = scenarios.find((s) => s.id == id);
                    }
                    setScenario(scenario);
                    setUsersToScenarioModalOpened(true);
                  }}
                >
                  {scenarios.map((scenario) => (
                    <Dropdown.Item key={scenario.id} eventKey={scenario.id}>
                      {scenario.name}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </span>

              <UsersToScenarioDialog
                show={isUsersToScenarioModalOpened}
                users={users.filter((user) =>
                  checkedUsersIDs.includes(user.id)
                )}
                scenario={scenario.name}
                onClose={(canceled) => handleAddUserToScenario(canceled)}
              />
            </>
          )}
        </Col>

        <Col md="auto">
          {isLoadingUsergroups ? (
            <Spinner />
          ) : (
            <>
              <span className="solid-button">
                <DropdownButton
                  title="Add to Usegroup"
                  onSelect={(id) => {
                    let usergroup;
                    if (usergroups.length > 0) {
                      usergroup = usergroups.find((s) => s.id == id);
                    }
                    setUsergroup(usergroup);
                    setUsersToUsegroupModalOpened(true);
                  }}
                >
                  {usergroups.map((usergroup) => (
                    <Dropdown.Item key={usergroup.id} eventKey={usergroup.id}>
                      {usergroup.name}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </span>

              {/* re-using same modal to implement adding suers to usergroup */}
              <UsersToScenarioDialog
                show={isUsersToUsegroupModalOpened}
                users={users.filter((user) =>
                  checkedUsersIDs.includes(user.id)
                )}
                scenario={usergroup.name}
                onClose={(canceled) => handleAddUsersToUsergroup(canceled)}
              />
            </>
          )}
        </Col>
      </Row>

      <NewUserDialog
        show={isNewModalOpened}
        onClose={(data) => handleAddNewUser(data)}
      />
      <EditUserDialog
        show={isEditModalOpened}
        onClose={(data) => handleEditUser(data)}
        user={userToEdit}
      />
      <DeleteDialog
        title="user"
        name={userToDelete.username}
        show={isDeleteModalOpened}
        onClose={(e) => handleDeleteUser(e)}
      />

      <div className="mt-4">
        <Usergroups />
      </div>
    </div>
  );
};

export default Users;
