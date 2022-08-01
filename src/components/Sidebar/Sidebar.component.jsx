import React, { useState } from "react";
import {Nav} from "react-bootstrap";
import {useNavigate} from 'react-router-dom';
import { Drawer, } from 'react-bootstrap-drawer';
import { useMsal } from "@azure/msal-react";

import { Collapse } from 'react-bootstrap';
// import '../pages/style/Dashboard.css'
import './Sidebar.css'
import 'react-bootstrap-drawer/lib/style.css';
const Sidebar = props => {
    const [open, setOpen] = useState(false);
    const { instance } = useMsal();

	const handleToggle = () => setOpen(!open);

    const handleLogout = (logoutType) => {
        instance.logoutPopup({
            postLogoutRedirectUri: "/",
            mainWindowRedirectUri: "/"
        });
        // if (logoutType === "popup") {
        //     instance.logoutPopup({
        //         postLogoutRedirectUri: "/",
        //         mainWindowRedirectUri: "/"
        //     });
        // } else if (logoutType === "redirect") {
        //     instance.logoutRedirect({
        //         postLogoutRedirectUri: "/",
        //     });
        // }
    }
	return (
		<Drawer { ...props }>
			<Drawer.Toggle onClick={ handleToggle } />

			<Collapse in={ open }>
				<Drawer.Overflow>
					<Drawer.ToC>
						<Drawer.Header href="/applications">Application</Drawer.Header>
						<Drawer.Nav>
							<Drawer.Item href="/settings">Settings</Drawer.Item>
                            {/* <Drawer.Item href="/" onClick={() => handleLogout()}>Logout</Drawer.Item> */}
						</Drawer.Nav>
					</Drawer.ToC>
				</Drawer.Overflow>
			</Collapse>
		</Drawer>
	);
}
//   const Sidebar = withRouter(Side);
  export default Sidebar