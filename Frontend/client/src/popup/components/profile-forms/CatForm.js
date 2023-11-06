import React, { useState, useEffect } from 'react';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addCat, getCatById, updateCat } from '../../actions/cat';
import catBreeds from './catBreeds';
import formatDate from '../../utils/formatDate';

const initialState = {
  location: '',
  status: '',
  bio: '',
  name: '',
  birthday: '',
  breed: '',
  sex: '',
};

const CatForm = ({ addCat, getCatById, updateCat, cat: { cat, loading, error } }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);

  const addingCat = useMatch('/add-cat');
  useEffect(() => {
    // if we finished loading and we do have a cat
    if (!addingCat && !cat) {
      navigate('/dashboard');
    }
    // then build our profileData
    if (!loading && cat && !addingCat) {
      const catData = { ...initialState };
      for (const key in cat) {
        if (key in catData) {
          if (key === 'birthday') {
            const originalDateStr = formatDate(cat[key]);
            const parts = originalDateStr.split('/');
            if (parts.length === 3) {
              const [month, day, year] = parts;
              const formattedDate = new Date(
                `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00Z`,
              );
              const formattedDateString = formattedDate.toISOString().split('T')[0];
              catData[key] = formattedDateString;
            }
            continue;
          }
          catData[key] = cat[key];
        }
      }

      // set local state with the profileData
      setFormData(catData);
    }
  }, [loading, getCatById, cat, addingCat, navigate]);

  const { name, sex, status, birthday, breed, bio } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (addingCat) {
        const submitted = await addCat(formData);
        if (submitted) {
          navigate('/dashboard');
        }
      } else {
        const submitted = await updateCat(formData, cat._id);
        if (submitted) {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <section className="container">
      <h1 className="large text-primary">{addingCat ? 'Add' : 'Update'} Your Cat</h1>
      <p className="lead">
        <i className="fa-solid fa-cat fa-shake"></i> {addingCat ? 'Create' : 'Update'} a profile of
        the cat you have
      </p>
      <small>* required field</small>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="* name"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
          <small className="form-text">The name of your cat*</small>
        </div>
        <div className="form-group">
          <select name="sex" value={sex} onChange={onChange} required>
            <option>* Select Sex of Your Cat</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <small className="form-text">The sex of your cat*</small>
        </div>
        <div className="form-group">
          <select name="status" value={status} onChange={onChange}>
            <option>* Select Status of Your Cat</option>
            <option value="Adoptable">Adoptable</option>
            <option value="Self Own">Self Own</option>
            <option value="Other">Other</option>
          </select>
          <small className="form-text">The status of your cat*</small>
        </div>
        <div className="form-group">
          <h4>Birthday Date</h4>
          <input type="date" name="birthday" value={birthday} onChange={onChange} />
        </div>
        <div className="form-group">
          <h4>Breed</h4>
          {/* <input
            type="text"
            name="breed"
            placeholder="Search for a breed"
            value={breed}
            onChange={onChange}
          /> */}
          <select name="breed" value={breed} onChange={onChange} open={true}>
            <option>Select Breed of Your Cat</option>
            {catBreeds.map((catBreed) => (
              <option key={catBreed} value={catBreed}>
                {catBreed}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
          <small className="form-text">The breed of your cat</small>
        </div>
        <div className="form-group">
          <textarea
            name="bio"
            cols="30"
            rows="5"
            placeholder="Cat Description"
            value={bio}
            onChange={onChange}
          />
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </section>
  );
};

CatForm.propTypes = {
  addCat: PropTypes.func.isRequired,
  getCatById: PropTypes.func.isRequired,
  updateCat: PropTypes.func.isRequired,
  cat: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  cat: state.cat,
});

export default connect(mapStateToProps, { addCat, getCatById, updateCat })(CatForm);
