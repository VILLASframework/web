
import React from "react";
import { screen,render,act,waitFor, within} from "@testing-library/react"
import {store} from "../store/index";
import {Router} from "react-router-dom";
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux";
import { createMemoryHistory } from 'history';
import Infrastructure from "../pages/infrastructure/infrastructure";
import '@testing-library/jest-dom';
import { test_login } from "./common";

beforeAll(test_login)
describe('Opens new ic dialog',()=>{
  beforeEach(()=>{
    const history = createMemoryHistory();
    render(
      <Provider store={store}>
        <Router history={history}>
          <Infrastructure/>
        </Router>
      </Provider>
    )
  })

  it('Renders page without crashing',async () => {
    await waitFor(async ()=>{
      expect(await screen.findByText('IC Managers')).toBeVisible()
    })
  });

  it('Clicks valid add ic button',async () => {
    const add = screen.getByRole('button',{name:/new-ic/i})
    await waitFor(async ()=>{
      expect(add).toBeVisible()
    })
  
    await act(async ()=>{
      await userEvent.click(add)
    })
    
    await waitFor(async ()=>{
      expect(await screen.findByText('New Infrastructure Component')).toBeVisible()
    })
  });
})

describe('Creates kubernetes simulator',()=>{
  let e;
  beforeEach(async ()=>{
    const history = createMemoryHistory();
    e = render(
      <Provider store={store}>
        <Router history={history}>
          <Infrastructure/>
        </Router>
      </Provider>
    ).baseElement
    await act(async ()=>{
      await userEvent.click(screen.getByRole('button',{name:/new-ic/i}))
    })
  })

  it("Navigates to select manager form",async ()=>{
    let cbf;
    await waitFor(async ()=>{
      cbf = within(screen.getByRole('form',{name:/check-man-form/i})).getByRole('checkbox')
      expect(cbf).not.toBeUndefined()
      expect(cbf).not.toBeNull()
      expect(cbf).not.toBeChecked()
    })
    
    await act(async ()=>{
      await userEvent.click(cbf)
    })

    await waitFor(async ()=>{
      expect(cbf).toBeChecked()
      expect(await screen.findByText('Manager to create new IC',{exact:false})).toBeVisible()
    })
  })

  it("Selects kubernetes manager from list", async ()=>{
    let dd;
    let kube;
    await act(async ()=>{
      await userEvent.click(within(screen.getByRole('form',{name:/check-man-form/i})).getByRole('checkbox'))
    })

    await waitFor(async ()=>{
      dd = screen.getByRole('option',{name:'Select manager'})
      expect(dd).toBeVisible()
      expect(dd.selected).toBe(true)
    })

    await act(async ()=>{
      await userEvent.click(dd)
    })

    await waitFor(async ()=>{ 
      kube = screen.getByRole('option',{name:'Kubernetes'})
      expect(kube.selected).toBe(false)
    })

    await act(async ()=>{
      await userEvent.selectOptions(dd.closest('select'),[kube.value])
    })

    await waitFor(async ()=>{
      expect(kube.selected).toBe(true)
      expect(e.querySelector('#jsonFormData')).toBeVisible()
    })
  })

  it("Fills and submits managed ic form",async ()=>{
    await act(async ()=>{
      await userEvent.click(within(screen.getByRole('form',{name:/check-man-form/i})).getByRole('checkbox'))
      const dd = screen.getByRole('option',{name:'Select manager'})
      await userEvent.click(dd)
      await userEvent.selectOptions(dd.closest('select'),[screen.getByRole('option',{name:'Kubernetes'}).value])
    })
    await waitFor(async ()=>{
      const form_data = {
        "img":{
          elem:screen.getByDisplayValue('perl'),
          input:"soullessblob/test-",
        },
        "jobname":{
          elem:screen.getByDisplayValue('myjob'),
          input:"test-run-job",
        },
        "uuid":{
          elem:screen.getByRole('textbox',{name:'UUID'}),
          input:crypto.randomUUID(),
        },
        "simname":{
          elem:screen.getByRole('textbox',{name:'Simulator Name'}),
          input:"test-run-sim",
        },
      }

      for (const i of [img,jobname,uuid,simname]){
        expect(i).toBeVisible()
        userEvent.type(i)
      }
    })
  })
})


